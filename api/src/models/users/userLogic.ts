import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { User, UserPayload } from './user'
import { Student } from '../../models/students/student'
import { userFromDynamo, allUsersFromDynamo, getSuiteStudentsFromDynamo, getUsersByRoleFromDynamo } from '../../services/fromDynamo'
import { successResponse, badRequestResponse, serverErrorResponse } from '../../services/rest'
import { userCreator, userDeletor } from '../../services/userCreateAndDelete'
import { getAllUsers } from '../../handlers/users/get-all-users'
import { addOrUpdateStudent, addOrUpdateUser, deleteUser } from '../../services/writeToDynamo'

/**
 * Logic for creating a BRIEF App user
 * @param {Object} event HTTP Request
 * @returns {Object} A success request response or a bad request response
 */
export async function createUsersLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const payload = event.body as unknown as UserPayload
    // Make sure there are no required fields missing in the payload and the fields are valid
    const missing = User.missingFields(payload)
    if (missing) return badRequestResponse(`Required Fields Missing: ${missing}`)
    const invalid = User.verifyFields(payload)
    if (invalid) return badRequestResponse(invalid.error)

    // Make sure required payload fields are present and valid
    // if (!payload.confirmationId) return badRequestResponse('Required Fields Missing: confirmationId')
    // if (typeof payload.confirmationId !== 'string') return badRequestResponse('confirmationId must be a string')
    // if (payload.role !== 'Student' && payload.role !== 'Instructor') return badRequestResponse('Role must be Student or Instructor')

    const { badRequest, serverError, email, firstName, lastName } = await userCreator(event)
    if (badRequest) return badRequest
    if (serverError) return serverError

    payload.suiteEmail = email
    payload.firstName = firstName
    payload.lastName = lastName

    // Make sure this user doesn't exist already
    const testUser = await userFromDynamo(payload.suiteEmail)
    if (testUser) return badRequestResponse('User Already Exists')

    // Create and add user to database, then return the user
    const user = new User(payload)
    // If the user's role is a student, add them to the student table
    if (payload.role == 'Student') {
        const student = new Student({ suiteEmail: user.suiteEmail })
        await addOrUpdateStudent(student)
    }
    await addOrUpdateUser(user)
    return successResponse({ user })
}

/**
 * @param {Object} event HTTP Request
 * @param {User} requestUser The requesting user
 * @returns {Object} A success or bad request response
 */
type EditUsersPathParams = { id:string }
type EditUsersBody = { suiteEmail?:string, firstName?:string, lastName?: string
    role?: string, courseIDs?: string[]}
export async function editUsersLogic (event: APIGatewayProxyEvent, requestUser: User): Promise<APIGatewayProxyResult> {
    // Check to verify the user performing the request is an instructor or admin
    if (!(requestUser.role === 'Admin' || requestUser.role === 'Instructor')) {
        return serverErrorResponse('Permission Denied', 'Only Admin or Instructor can edit users')
    }

    try {
        // Acquire the payload
        const payload: EditUsersBody = JSON.parse(event.body)

        // Make sure the payload user exists
        const userTemp = await userFromDynamo(payload.suiteEmail)
        if (!userTemp) return badRequestResponse('User to Edit Not Found')

        // Verify the user fields in the payload
        const invalid = User.verifyFields(payload)
        if (invalid) return badRequestResponse(invalid.error)

        const { id } = event.pathParameters as EditUsersPathParams
        const userToUpdate: User | null = await userFromDynamo(id)
        if (!userToUpdate) return badRequestResponse('Attempt Under Given ID Not Found', 404)

        // Update the user details
        userToUpdate.lastName = payload.lastName || userToUpdate.lastName
        userToUpdate.firstName = payload.firstName || userToUpdate.firstName
        userToUpdate.suiteEmail = payload.suiteEmail || userToUpdate.suiteEmail
        userToUpdate.role = payload.role || userToUpdate.role
        userToUpdate.courseIDs = payload.courseIDs || userToUpdate.courseIDs

        await addOrUpdateUser(userToUpdate)
        return successResponse({ user: userToUpdate })
    } catch (err) {
        return serverErrorResponse(err, 'editUsersLogic')
    }
}

/**
 * Logic for deleting a BRIEF App user
 * @param {Object} event HTTP Request
 * @param {User} requestUser The requesting user
 * @returns {Object} A success, bad request, or server error response
 */
export async function deleteUserLogic (event: APIGatewayProxyEvent, requestUser: User): Promise<APIGatewayProxyResult> {
    try {
        const res = await deleteUserHelper(event, requestUser, true)
        if (res.serverError) return res.serverError
        if (res.badRequest) return res.badRequest
        return successResponse(res)
    } catch (err) {
        return serverErrorResponse(err, 'deleteUserLogic')
    }
}
type AdminDeleteUsersEvent = {emails:string | string []}
export async function adminDeleteUsersLogic (event: APIGatewayProxyEvent, reqUser: User, serverAdmin: boolean): Promise<APIGatewayProxyResult> {
    try {
        let { emails } = event.queryStringParameters as AdminDeleteUsersEvent
        if (!emails) return badRequestResponse('Required Query String Parameter Missing: emails')
        emails = (emails as string).replaceAll(' ', '').split(',')

        const users = []
        for (const email of emails) {
            const delUser = await userFromDynamo(email)
            if (delUser) {
                const { user } = await deleteUserHelper(event, delUser, false, { reqUser, serverAdmin })
                if (user) users.push(user)
            }
        }

        return successResponse(users)
    } catch (err) {
        return serverErrorResponse(err, 'adminDeleteUsersLogic')
    }
}

type AdminGetUsersEvent = { suiteEmail?:string, role?:string, withStudents?:string }
export async function adminGetUsersLogic (event: APIGatewayProxyEvent, reqUser: User, serverAdmin: boolean): Promise<APIGatewayProxyResult> {
    try {
        const { suiteEmail, role, withStudents } = event.queryStringParameters as AdminGetUsersEvent

        if (!suiteEmail && !role && !withStudents) return getAllUsers(event)

        // if a specific email is requested
        if (suiteEmail) {
            const email = await userFromDynamo({ suiteEmail })
            // if no admin user found, and with students is included, check students for email
            if (!email && withStudents) {
                // not sure if this is right yet
                const studentEmail = await getSuiteStudentsFromDynamo({ suiteEmail })
                if (!studentEmail) return badRequestResponse('Email Not Found, 404')
                return successResponse({ studentEmail })
            }

            if (!email) return badRequestResponse('Email Not Found, 404')
            return successResponse({ email })
        }

        if (role && !withStudents) {
            return getRoleUsersLogic({ role })
        }

        if (role && withStudents) {
            // Not really sure if this is necessary...
        }
    } catch (err) {
        return serverErrorResponse(err, 'adminGetUsersLogic')
    }
}

/**
 *
 * Logic for getting users associated with a course
 * @param {Object} event The HTTP Request
 * @returns {Object} A success or bad request response
 */
type GetCourseUsersPathParam = {courseID:string}
export async function getCourseUsersLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // Get courseID from path parameters
    const { courseID } = event.pathParameters as GetCourseUsersPathParam

    try {
        // Get all users
        const tempusers = await allUsersFromDynamo()
        // Filter user array based on courseID, return as users
        const users = tempusers.filter(user =>
            user.courseIDs.includes(courseID)
        )
        return successResponse({ users })
    } catch (err) {
        return serverErrorResponse(err, 'getCourseUsersLogic')
    }
}

/**
 *
 * Logic for getting users with a certain role
 * @param {Object} event The HTTP Request
 * @returns {Object} A success or bad request response
 */
// type GetRoleUsersPathParam = {role:string}
// export async function getRoleUsersLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
export const getRoleUsersLogic = async (role) => {
    // Get role from path parameters
    // const { role } = event.pathParameters as GetRoleUsersPathParam
    // If the role specified is not one of the valid roles
    if (role === 'Super' || role === 'Admin' || role === 'Student' || role === 'Instructor') {
        // Do nothing, role is proper
    } else {
        return badRequestResponse('Role is invalid... Should be Super, Admin, Student, or Instructor: ' + role)
    }
    try {
        const users = getUsersByRoleFromDynamo(role)
        return successResponse({ users })
    } catch (err) {
        return serverErrorResponse(err, 'getRoleUsersLogic')
    }
}

type userHelperParam = { reqUser?: User | null, serverAdmin?: boolean }
async function deleteUserHelper (event: APIGatewayProxyEvent, user: User, self: boolean, { reqUser = null, serverAdmin = false }: userHelperParam = {}) {
    try {
        const { role } = user
        if (role === 'Super') return { badRequest: badRequestResponse('Super Admin\'s Can Not Be Deleted') }

        const { badRequest, serverError } = await userDeletor(event, { self, user, reqUser, serverAdmin })
        if (badRequest) return { badRequest }
        if (serverError) return { serverError }

        // TODO: Delete any items tied directly to this user

        await deleteUser(user.suiteEmail)

        return { user }
    } catch (err) {
        return { serverError: serverErrorResponse(err) }
    }
}

// exports.deleteUserHelper = deleteUserHelper
