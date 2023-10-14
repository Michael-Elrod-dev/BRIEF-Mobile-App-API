import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { allUsersFromDynamo } from '../../services/fromDynamo'
import { serverErrorResponse, checkAuthorization, badRequestResponse, successResponse } from '../../services/rest'
/**
 * Function gets and returns all the BRIEF App users
 * @param {Object} event HTTP Request
 * @returns A Success, Bad Request, or Server Error Response
 */
export async function getAllUsers (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Check the users access token
        const auth = await checkAuthorization(event)
        if (auth.error) return badRequestResponse(auth.error, auth.code ?? 400)

        // Make sure the user is authorized to perform the request (MAYBE EXPAND UPON)
        if (!auth.user) return badRequestResponse('User Not Found')

        // Get all users
        const users = await allUsersFromDynamo()

        // Return the users
        return successResponse({ users })
    } catch (err) {
        return serverErrorResponse(err)
    }
}
