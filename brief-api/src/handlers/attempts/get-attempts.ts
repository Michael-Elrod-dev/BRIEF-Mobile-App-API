import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAttemptsLogic } from '../../models/attempts/attemptLogic'
import { serverErrorResponse, checkAuthorization, badRequestResponse } from '../../services/rest'

/**
 * Function gets all courses
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function getAttempts (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        /*
        // Make sure user has a valid bearer auth token and user exists
        const auth = await checkAuthorization(event)
        if(auth.error) return badRequestResponse(auth.error, auth.code ?? 400)
        if(!auth.user) return badRequestResponse('User Not Found')
        */
        return getAttemptsLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
