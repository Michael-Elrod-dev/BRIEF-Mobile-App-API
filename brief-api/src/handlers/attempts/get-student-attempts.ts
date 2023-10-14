import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getStudentAttemptsLogic } from '../../models/attempts/attemptLogic'
import { checkAuthorization, badRequestResponse, serverErrorResponse } from '../../services/rest'

/**
 * Function for getting a attempts for a student
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function getStudentAttempts (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        /*
        // Make sure user has a valid bearer auth token and user exists
        import auth = await checkAuthorization(event)
        if(auth.error) return badRequestResponse(auth.error, auth.code ?? 400)
        if(!auth.user) return badRequestResponse('User Not Found')
        */
        return await getStudentAttemptsLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
