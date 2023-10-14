import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteUserLogic } from '../../models/users/userLogic'
import { serverErrorResponse, checkAuthorization, badRequestResponse, preparePayload } from '../../services/rest'
import { adminPrivileges } from '../../services/roles'

/**
 * Function deletes a BRIEF App user
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function deleteUser (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        // Check requesting users auth token
        const { badRequest, user, decryptedToken } = await checkAuthorization(event)
        if (badRequest) return badRequest

        if (!user) {
            if (!decryptedToken!.serverAdmin) return badRequestResponse('User Unauthorized To Access This Route', 403)
        } else {
            if (!adminPrivileges(user)) return badRequestResponse('User Unauthorized To Access This Route', 403)
        }

        return await deleteUserLogic(event, user!, decryptedToken!.serverAdmin!)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
