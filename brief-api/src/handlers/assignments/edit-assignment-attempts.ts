import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { editAssignmentsAttemptLogic } from '../../models/assignments/assignmentLogic'
import { serverErrorResponse, badRequestResponse, preparePayload, checkAuthorization } from '../../services/rest'

/**
 * Function edits a BRIEF attempt
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function editAssignmentAttempts (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        // Make sure the auth header contains a valid access token
        const auth = await checkAuthorization(event)
        if (auth.error) return badRequestResponse(auth.error, auth.code ?? 400)

        // If user is found, run the edit assignment logic
        if (!auth.user) return badRequestResponse('User Not Found')

        return editAssignmentsAttemptLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
