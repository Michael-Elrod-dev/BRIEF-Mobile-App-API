import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getStudentsLogic } from '../../models/students/studentLogic'
import { serverErrorResponse, checkAuthorization, badRequestResponse } from '../../services/rest'
import { instructorPrivileges } from '../../services/roles'
import { authWrapper, NLMAHandlerParams } from '../../services/wrappers'

async function handler ({ event, user }:NLMAHandlerParams) {
    try {
        // If requesting user is not at least an instructor, return a bad request response
        if (!instructorPrivileges(user!)) return badRequestResponse('User Unauthorized For This Action', 403)
        return await getStudentsLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}

export const getAllStudents = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => authWrapper(event, handler)
