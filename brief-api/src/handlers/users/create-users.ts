import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createUsersLogic } from '../../models/users/userLogic'
import { preparePayload, serverErrorResponse } from '../../services/rest'
/**
 * Function creates a BRIEF App user
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function createUsers (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        return await createUsersLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
