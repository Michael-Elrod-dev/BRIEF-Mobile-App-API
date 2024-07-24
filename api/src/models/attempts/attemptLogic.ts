import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Attempt, AttemptPayload } from './attempt'
import { successResponse, badRequestResponse, serverErrorResponse } from '../../services/rest'
import { allAttemptsFromDynamo, attemptFromDynamo } from '../../services/fromDynamo'
import { generateId } from '../../services/general'
import { ATTEMPT_TABLE } from '../../services/tables'
import { addOrUpdateAttempt, deleteAttempt } from '../../services/writeToDynamo'

/**
 * Logic for creating a BRIEF attempt
 * @param {Object} event HTTP Request
 * @returns {Object} A success or bad request response
 */

export async function createAttemptLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const payload = event.body as unknown as AttemptPayload
    // Make sure there are no required fields missing in the payload and the fields are valid
    const missing = Attempt.missingFields(payload)
    if (missing) return badRequestResponse(`Required Fields Missing: ${missing}`)
    const invalid = Attempt.verifyFields(payload)
    if (invalid) return badRequestResponse(invalid.error)

    // Generate ID for the attempt
    const id = await generateId(ATTEMPT_TABLE, 'id', 25, { ModelClass: Attempt })
    payload.id = id

    // Create and add attempt to database, then return the attempt
    const attempt = new Attempt(payload)
    await addOrUpdateAttempt(attempt)
    return successResponse({ attempt })
}

/**
 * Logic for an attempt with a certain id
 * @returns {Object} A success response an attempt with an attempt
 */
type GetAttemptsPathParam = {pathId:string}

export async function getAttemptsLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // get attempt id from path
    const { pathId } = event.pathParameters as GetAttemptsPathParam

    try {
        // get attempts from database
        const allAttempts = await allAttemptsFromDynamo()
        const attempts = allAttempts.filter(attempt => attempt.id === pathId)
        return successResponse({ attempts })
    } catch (err) {
        return serverErrorResponse(err, 'getAttemptsLogic')
    }
}

/**
 * Logic for getting an attempts with a certain assignment
 * @param {Object} event The HTTP Request
 * @returns {Object} A success response an attempt with an attempt
 */
type GetAssignmentAttemptsPathParam = {pathAssignment:string}

export async function getAssignmentAttemptsLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // get assignment id from path
    const { pathAssignment } = event.pathParameters as GetAssignmentAttemptsPathParam

    try {
        const allAttempts = await allAttemptsFromDynamo()
        const attempts = allAttempts.filter(attempt => attempt.assignmentID === pathAssignment)
        return successResponse({ attempts })
    } catch (err) {
        return serverErrorResponse(err, 'getAssignmentAttemptsLogic')
    }
}

 /**
 * Logic for getting an attempts with a certain student
 * @param {Object} event The HTTP Request
 * @returns {Object} A success response an attempt with an attempt
 */
 type GetStudentAttemptsPathParam = {pathEmail:string}
export async function getStudentAttemptsLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // get suiteEmail from path
    const { pathEmail } = event.pathParameters as GetStudentAttemptsPathParam

    try {
        const allAttempts = await allAttemptsFromDynamo()
        const attempts = allAttempts.filter(attempt => attempt.suiteEmail === pathEmail)
        return successResponse({ attempts })
    } catch (err) {
        return serverErrorResponse(err, 'getStudentAttemptsLogic')
    }
}

 /**
 * Logic for deleting an attempt with a certain id
 * @param {Object} event The HTTP Request
 * @returns {Object} A success response an attempt with an attempt
 */
 type DeleteAttemptsPathParam = {attemptIdFromPath:string}
export async function deleteAttemptsLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // get id from path
    const { attemptIdFromPath } = event.pathParameters as DeleteAttemptsPathParam

    try {
        const allAttempts = await allAttemptsFromDynamo()
        const attempts = allAttempts.filter(attempt => attempt.id === attemptIdFromPath)
        await deleteAttempt(attemptIdFromPath)
        return successResponse({ attempts })
    } catch (err) {
        return serverErrorResponse(err, 'deleteAttemptsLogic')
    }
}
