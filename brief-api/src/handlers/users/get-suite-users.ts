import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { userFromDynamo } from '../../services/fromDynamo'
import { serverErrorResponse, checkAuthorization, badRequestResponse, successResponse } from '../../services/rest'

/**
 * Function gets and returns all users associated with a certain suite email
 * @param {Object} event The HTTP Request
 * @returns {Object} A success or bad request response
 */
type GetSuiteUserssPathParam = {suiteEmail:string}

export async function getSuiteUsers (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Check the users access token
        const auth = await checkAuthorization(event)
        if (auth.error) return badRequestResponse(auth.error, auth.code ?? 400)

        // Get suiteEmail from path and user from database
        const { suiteEmail } = event.pathParameters as GetSuiteUserssPathParam
        const user = await userFromDynamo(suiteEmail)

        if (!user) return badRequestResponse('User Not Found')
        return successResponse({ user })
    } catch (err) {
        return serverErrorResponse(err)
    }
}
