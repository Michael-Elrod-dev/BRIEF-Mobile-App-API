import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { editAssignmentsLogic } from '../../models/assignments/assignmentLogic'
import { serverErrorResponse, checkAuthorization, badRequestResponse, preparePayload } from '../../services/rest'

/**
 * Function edits a BRIEF App Assignment
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function editAssignments (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        // Make sure the auth header contains a valid access token
        const auth = await checkAuthorization(event)
        if (auth.error) return badRequestResponse(auth.error, auth.code ?? 400)

        // If user is found, run the edit assignment logic
        if (!auth.user) return badRequestResponse('User Not Found')

        return editAssignmentsLogic(event, auth.user)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
