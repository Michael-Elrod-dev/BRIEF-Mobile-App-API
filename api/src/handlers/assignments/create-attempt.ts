import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequestResponse } from '../../services/rest'
import { instructorPrivileges } from '../../services/roles'
import { NLMAHandlerParams, authWrapper } from '../../services/wrappers'
import { createAssignmentAttemptLogic } from '../../models/assignments/assignmentLogic'

async function handler ({ event, user }:NLMAHandlerParams) {
    if (user == null) return badRequestResponse('User unknown', 403)
    // If requesting user is not at student, return a bad request response
    //if (instructorPrivileges(user!)) return badRequestResponse('User Unauthorized For This Action', 403)
    return await createAssignmentAttemptLogic(event, user)
}

export const createAttempt = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => authWrapper(event, handler)