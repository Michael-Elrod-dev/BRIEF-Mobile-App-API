import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { editUsersLogic } from '../../models/users/userLogic'
import { serverErrorResponse, checkAuthorization, badRequestResponse, preparePayload } from '../../services/rest'

/**
 * Function edits a BRIEF App user
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function editUsers (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        // Make sure the auth header contains a valid access token
        const auth = await checkAuthorization(event)
        if (auth.error) return badRequestResponse(auth.error, auth.code ?? 400)

        // If user is found, run the edit user logic
        if (!auth.user) return badRequestResponse('User Not Found')
        return editUsersLogic(event, auth.user)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
