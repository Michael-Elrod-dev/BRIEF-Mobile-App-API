import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequestResponse } from '../../services/rest'
import { instructorPrivileges } from '../../services/roles'
import { NLMAHandlerParams, authWrapper } from '../../services/wrappers'
import { deleteAssignmentAttemptsLogic } from '../../models/assignments/assignmentLogic'

async function handler ({ event, user }:NLMAHandlerParams) {
    // If requesting user is not at least an instructor, return a bad request response
    if (user == null) return badRequestResponse('User unknown', 403)
    return await deleteAssignmentAttemptsLogic(event, user)
}

export const deleteAssignmentAttempts = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => authWrapper(event, handler)
