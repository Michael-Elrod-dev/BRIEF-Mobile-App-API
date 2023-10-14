import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getSuiteStudentsLogic } from '../../models/students/studentLogic'
import { checkAuthorization, badRequestResponse, serverErrorResponse } from '../../services/rest'

/**
 * Function for getting a student from a suite email
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function getSuiteStudents (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        /*
        // Make sure user has a valid bearer auth token and user exists
        const auth = await checkAuthorization(event)
        if(auth.error) return badRequestResponse(auth.error, auth.code ?? 400)
        if(!auth.user) return badRequestResponse('User Not Found')
        */
        return await getSuiteStudentsLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
