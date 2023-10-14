import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { refreshUserToken } from '../../services/axios'
import { serverErrorResponse, badRequestResponse, successResponse } from '../../services/rest'

/**
 * Function refreshes a users session and returns the new access token
 * @param {Object} event The http request
 * @returns {Object} A success, bad request, or server error response
 */
export async function refreshToken (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Request and return secondary app token information from the suite api
        const payload = {
            appName: process.env.APP_NAME,
            appKey: process.env.APP_KEY
        }
        const res = await refreshUserToken(event.headers.Authorization ?? '', payload)
        if (res.error) return badRequestResponse(res.error)
        return successResponse(res)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
