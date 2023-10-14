import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequestResponse } from '../../services/rest'
import { instructorPrivileges } from '../../services/roles'
import { NLMAHandlerParams, authWrapper } from '../../services/wrappers'
import { createAssignmentsLogic } from '../../models/assignments/assignmentLogic'

async function handler ({ event, user }:NLMAHandlerParams) {
    // If requesting user is not at least an instructor, return a bad request response
    if (!instructorPrivileges(user!)) return badRequestResponse('User Unauthorized For This Action', 403)
    return await createAssignmentsLogic(event)
}

export const createAssignments = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => authWrapper(event, handler)
