import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequestResponse, prepareQueryStringParameters } from '../../services/rest'
import { instructorPrivileges } from '../../services/roles'
import { NLMAHandlerParams, authWrapper } from '../../services/wrappers'
import { deleteAssignmentsLogic } from '../../models/assignments/assignmentLogic'

async function handler ({ event, user }:NLMAHandlerParams) {
    // If requesting user is not at least an instructor, return a bad request response
    if (user == null) return badRequestResponse('User unknown', 403)
    if (!instructorPrivileges(user!)) return badRequestResponse('User Unauthorized For This Action', 403)
    return await deleteAssignmentsLogic(event, user)
}

export const deleteAssignments = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => authWrapper(event, handler)
