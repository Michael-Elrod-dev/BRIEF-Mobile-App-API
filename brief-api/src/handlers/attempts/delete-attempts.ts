import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteAttemptsLogic } from '../../models/attempts/attemptLogic'
import { serverErrorResponse, badRequestResponse, preparePayload, checkAuthorization } from '../../services/rest'

/**
 * Function deletes a BRIEF Attempt
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function deleteAttempts (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        /*
        // Get the user information from the passed in Authorization header
        const auth = await checkAuthorization(event)
        if (auth.error) return badRequestResponse(auth.error)

         // Make sure the user is found and is the correct role
        if (!auth.user) return badRequestResponse('Requesting User Not Found')
        */
        return await deleteAttemptsLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
