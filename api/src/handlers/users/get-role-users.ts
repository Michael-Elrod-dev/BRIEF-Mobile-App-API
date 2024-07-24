import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getRoleUsersLogic } from '../../models/users/userLogic'
import { checkAuthorization, badRequestResponse, serverErrorResponse } from '../../services/rest'
/**
 * Function for getting users with a certain role
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function getRoleUsers (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Make sure user has a valid bearer auth token
        const auth = await checkAuthorization(event)
        if (auth.error) return badRequestResponse(auth.error, auth.code ?? 400)

        return await getRoleUsersLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
