import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Student } from './student'
import { successResponse, badRequestResponse, serverErrorResponse } from '../../services/rest'
import { allAssignmentsFromDynamo, allStudentsFromDynamo, allStudentsinCourseFromDynamo, getSuiteStudentsFromDynamo } from '../../services/fromDynamo'
import { STUDENT_TABLE } from '../../services/tables'

/**
 * Logic for getting students under a given suite-email,
 * all students in a course under a given course-id,
 * or all students and their assignments.
 * Instructors will only be allowed to see students in their courses
 * @returns {Object} A success response with the students
 */
type GetStudentsQSPs = { suiteEmail?:string, courseID?:string }
export async function getStudentsLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const { suiteEmail, courseID } = event.queryStringParameters as GetStudentsQSPs

        if (suiteEmail) {
            const email = await getSuiteStudentsFromDynamo({ suiteEmail })
            if (!email) return badRequestResponse('Email Not Found, 404')
            return successResponse({ email })
        }

        if (courseID) {
            const students = await allStudentsinCourseFromDynamo({ courseID })
            if (!students) return badRequestResponse('Course Not Found, 404')
            return successResponse({ students })
        }

        const allStudents = await allStudentsFromDynamo
        return successResponse({ allStudents })
    } catch (err) {
        return serverErrorResponse(err, 'getStudentsLogic')
    }
}

/**
 * Logic for getting a student with a certain suiteEmail
 * @param {Object} event The HTTP Request
 * @returns {Object} A success or bad request response
 */
type GetSuiteStudentsPathParam = {pathEmail:string}
export async function getSuiteStudentsLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // Get suiteEmail from path and student from database
    const { pathEmail } = event.pathParameters as GetSuiteStudentsPathParam
    try {
        const allStudents = await allStudentsFromDynamo()
        const students = allStudents.filter(student => student.suiteEmail === pathEmail)
        return successResponse({ students })
    } catch (err) {
        return serverErrorResponse(err, 'getSuiteStudentsLogic')
    }
}

/**
 * Logic for getting students with certain assignmentID
 * @param {Object} event The HTTP Request
 * @returns {Object} A success or bad request response
 */

type GetAssignmentStudentsPathParam = {pathAssignment:string}

export async function getAssignmentStudentsLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // get assignment from path
    const { pathAssignment } = event.pathParameters as GetAssignmentStudentsPathParam
    const students = []

    try {
        // get students with assignment
        const allStudents = await allStudentsFromDynamo()
        for (let i = 0; i < allStudents.length; i++) {
            for (let j = 0; j < allStudents[i].assignmentIDs.length; j++) {
                if (allStudents[i].assignmentIDs[j] === pathAssignment) {
                    students.push(allStudents[i])
                }
            }
        }
        return successResponse({ students })
    } catch (err) {
        return serverErrorResponse(err, 'getAssignmentStudentsLogic')
    }
}
