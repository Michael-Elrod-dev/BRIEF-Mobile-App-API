import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getCourseUsersLogic } from '../../models/users/userLogic'
import { checkAuthorization, badRequestResponse, serverErrorResponse } from '../../services/rest'

/**
 * Function for getting users associated with a certain course
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function getCourseUsers (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Make sure user has a valid bearer auth token
        const { badRequest, user } = await checkAuthorization(event)
        if (badRequest) return badRequest
        return await getCourseUsersLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
