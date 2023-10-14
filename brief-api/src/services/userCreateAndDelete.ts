import { APIGatewayProxyEvent } from 'aws-lambda'
import { User } from '../models/users/user'
import { confirmUser, createNewSuiteUser, adminCreateUser, suiteDeleteUser } from './axios'
import { userFromDynamo } from './fromDynamo'
import { serverErrorResponse, badRequestResponse } from './rest'
import { superPrivileges, adminPrivileges } from './roles'

/**
 * Helper function adds this app to a suite user and returns the suite user's information
 * @param {APIGatewayProxyEvent} event The http request
 * @returns {{badRequest: APIGatewayProxyResult} | {serverError : APIGatewayProxyResult} | {email: string, firstName: string, lastName: string, phoneNumber: string}}
 */
export const userCreator = async (event: APIGatewayProxyEvent) => {
    try {
        const { confirmationId, firstName, lastName, phoneNumber, email, role } = event.body as any

        // Get the new user based on if they're being confirmed or created. Confirmation has priority
        let res
        if (confirmationId) {
            res = await confirmUser({
                confirmationId,
                app: process.env.APP_NAME,
                key: process.env.APP_KEY,
                role
            })
        } else if (firstName && lastName && email && phoneNumber) {
            res = await createNewSuiteUser({
                firstName,
                lastName,
                email,
                phoneNumber,
                tempPassword: true,
                appName: process.env.APP_NAME,
                appKey: process.env.APP_KEY,
                appRole: role
            })
        } else if (email) {
            res = await adminCreateUser({
                email,
                appName: process.env.APP_NAME,
                appKey: process.env.APP_KEY,
                role
            }, event.headers)
        } else return { serverError: serverErrorResponse('User Creator Must Be Called With A Payload That Contains (confirmationId), (firstName, lastName, email, and phoneNumber), or (email)', 'userCreator') }

        if (res.error) return { badRequest: badRequestResponse(res.error) }
        return { email: res.user.email, firstName: res.user.firstName, lastName: res.user.lastName, phoneNumber: res.user.phoneNumber }
    } catch (err) {
        return { serverError: serverErrorResponse(err, 'userCreator') }
    }
}

type UserDeletorParams = {
    user?: User|null,
    email?: string,
    self?: boolean,
    reqUser?: User|null,
    serverAdmin?: boolean
}
/**
 * Helper function removes this app from a user's suite user
 * @param {APIGatewayProxyEvent} event The http request
 * @param {*} params Named optional parameters
 * @returns { {serverError: Object} | {badRequest: Object} | {} } Empty object if successful, server error if there was a server error, bad request if bad request
 */
export const userDeletor = async (event:APIGatewayProxyEvent, params: UserDeletorParams) => {
    try {
        let { user, email, reqUser, self } = params
        const serverAdmin = params.serverAdmin ?? false
        if (self === null) return { serverError: serverErrorResponse('deleteUserHelper - self Must Be Supplied') }
        if (!self && (reqUser === null && !serverAdmin)) return { serverError: serverErrorResponse('deleteUserHelper - reqUser Must Be Supplied If self Is False') }
        if (user === null && email === null) return { serverError: serverErrorResponse('deleteUserHelper - user or email Must Be Supplied') }

        // Get the user that's being deleted
        if (!user) {
            user = await userFromDynamo(email as string)
            if (!user) return { badRequest: badRequestResponse('User Not Found') }
        }

        // Super admins cannot be deleted and admins cannot delete other admins
        if (superPrivileges(user)) return { badRequest: badRequestResponse('Super Admin\'s Cannot Be Deleted', 403) }
        if (!self && adminPrivileges(user) && (!superPrivileges(reqUser as User) || serverAdmin)) return { badRequest: badRequestResponse('Admins Cannot Delete Other Admins', 403) }

        // Remove this app from the user's Suite user
        let res:any = {}
        if (self) res = await suiteDeleteUser(event.headers.Authorization as string)
        else res = await suiteDeleteUser(event.headers.Authorization as string, user.suiteEmail)

        if (res.error) return { badRequest: badRequestResponse(`Suite Error: ${res.error}`) }

        return {}
    } catch (err) {
        return { serverError: serverErrorResponse(err, 'userDeletor') }
    }
}
