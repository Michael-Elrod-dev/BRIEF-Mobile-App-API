import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { adminDeleteUsersLogic, adminGetUsersLogic } from '../../../models/users/userLogic'
import { serverErrorResponse, checkAuthorization, badRequestResponse, prepareQueryStringParameters } from '../../../services/rest'
import { adminPrivileges } from '../../../services/roles'

export async function adminGetUsers (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Check requesting users auth token
        const { badRequest, user, decryptedToken } = await checkAuthorization(event)
        if (badRequest) return badRequest

        // If there's no user, make sure this is the server admin, if there is a user, make sure it's an admin
        if (!user) {
            if (!decryptedToken!.serverAdmin) return badRequestResponse('User Unauthorized To Access This Route', 403)
        } else {
            if (!adminPrivileges(user)) return badRequestResponse('User Unauthorized To Access This Route', 403)
        }

        // Prepare query string parameters and execute the logic
        prepareQueryStringParameters(event)
        return await adminGetUsersLogic(event, user!, decryptedToken!.serverAdmin!)
    } catch (err) {
        return serverErrorResponse(err, 'adminGetUsers')
    }
}