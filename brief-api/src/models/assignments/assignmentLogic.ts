import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { User } from '../../models/users/user'
import { Assignment, AssignmentPayload } from '../../models/assignments/assignment'
import { allAssignmentsFromDynamo, allAttemptsFromDynamo, assignmentFromDynamo, attemptFromDynamo } from '../../services/fromDynamo'
import { generateId } from '../../services/general'
import { successResponse, badRequestResponse, serverErrorResponse } from '../../services/rest'
import { ASSIGNMENT_TABLE, ATTEMPT_TABLE } from '../../services/tables'
import { adminPrivileges, instructorPrivileges, studentPrivileges } from '../../services/roles'
import { addOrUpdateAssignment, addOrUpdateAttempt, deleteAssignment, deleteAttempt } from '../../services/writeToDynamo'
import { Attempt, AttemptPayload } from '../attempts/attempt'

/**
 * Logic for creating a BRIEF App Assignment
 * @param {Object} event HTTP Request
 * @returns {Object} A success request response or a bad request response
 */

export async function createAssignmentsLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const payload = event.body as unknown as AssignmentPayload
    // Make sure there are no required fields missing in the payload and the fields are valid
    const missing = Assignment.missingFields(payload)
    if (missing) return badRequestResponse(`Required Fields Missing: ${missing}`)
    const invalid = Assignment.verifyFields(payload)
    if (invalid) return badRequestResponse(invalid.error)

    // Generate ID for the Assignment
    const id = await generateId(ASSIGNMENT_TABLE, 'id', 25, { ModelClass: Assignment })
    payload.id = id

    // Make sure this assignment doesn't exist already
    const testAssignment = await assignmentFromDynamo(payload.id)
    if (testAssignment) return badRequestResponse('Assignment Already Exists')

    // Create and add assignment to database, then return the assignment
    const assignment = new Assignment(payload)
    await addOrUpdateAssignment(assignment)
    return successResponse({ assignment })
}

/**
 * Logic for creating a BRIEF App Attempt for a specified assignment
 * @param {Object} event HTTP Request
 * @param {User} user The requesting user
 * @returns {Object} A success request response or a bad request response
 */
type CreateAttemptParam = {assignmentID: string}
export async function createAssignmentAttemptLogic (event: APIGatewayProxyEvent, user: User): Promise<APIGatewayProxyResult> {
    const {assignmentID} = event.pathParameters as CreateAttemptParam
    const assignment = await assignmentFromDynamo(assignmentID)
    const body = event.body
    //var answers = body?.split(",")

    var payload: AttemptPayload = {
        "id": "0",
        "suiteEmail": user.suiteEmail,
        "assignmentID": assignmentID,
        "completed": "false",
        "score": 0
    }

    if(body?.length === assignment?.questions.length){
        payload.completed = "true"
    }

    // Generate ID for the attempt
    const id = await generateId(ATTEMPT_TABLE, 'id', 25, { ModelClass: Attempt })
    payload.id = id

    // Make sure this attempt doesn't exist already
    const testAttempt = await attemptFromDynamo(payload.id)
    if (testAttempt) return badRequestResponse('Attempt Already Exists')

    // Create and add attempt to database, then return the attempt
    const attempt = new Attempt(payload)
    await addOrUpdateAttempt(attempt)
    assignment?.attempts.push(payload.id)
    return successResponse({ attempt })
}

/*
 * Logic for editing an attempt
 * @param {Object} event The HTTP Request
 * @param {User} user The requesting user
 * @returns {Object} A success or bad request response
 */
type EditAttemptPathParams = { id:string }
type EditAttemptBody = {suiteEmail?: string, assignmentID?: string,
    score?: number, completed?: string}
export async function editAssignmentsAttemptLogic(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Verify the fields in the payload
        const payload = event.body as unknown as { answers: { id: string, answer: string }[] };
        
        // Check if answers are provided in the payload
        if (!payload.answers || !Array.isArray(payload.answers)) {
            return badRequestResponse('Answers field missing or invalid');
        }

        const { attemptID } = event.pathParameters as { attemptID: string };
        
        // Fetch the attempt using the provided attemptID
        const attempt: Attempt | null = await attemptFromDynamo(attemptID);
        
        if (!attempt) {
            return badRequestResponse('Attempt Under Given ID Not Found', 404);
        }

        // If the attempt is not completed (assuming "false" represents not completed), edit it
        if (attempt.completed === "false") {
            // Currently, the Attempt model doesn't have an "answers" property,
            // so we can't assign payload.answers to attempt.answers directly.

            // Check if all assignment questions have been answered
            // Assuming that we can compare the length of answers to the number of questions in the associated assignment
            // if (payload.answers.length === /* some logic to get total number of questions in the associated assignment */) {
            //     attempt.completed = "true";
            //     // Generate score for the attempt based on the provided answers
            //     attempt.score = /* some logic to calculate score based on answers */;
            // }

            await addOrUpdateAttempt(attempt);
        }

        return successResponse({ attempt: attempt });
    } catch (err) {
        return serverErrorResponse(err, 'editAssignmentsAttemptLogic');
    }
}


/**
 * Logic for retrieving BRIEF App Assignments
 * @param {Object} event HTTP Request
 * @returns {Object} A success request response or a bad request response
 */
type GetAssignmentsQSPs = { id?: string, course_id?: string, with_attempts?: string }
export async function getAssignmentsLogic (event: APIGatewayProxyEvent, user: User): Promise<APIGatewayProxyResult> {
    const { id, course_id, with_attempts } = event.queryStringParameters as GetAssignmentsQSPs
    try {
        if (id) {
            const assignment = await assignmentFromDynamo(id)
            if (assignment === null) return badRequestResponse('Assignment not found')
            if (!adminPrivileges(user) && !user.courseIDs.includes(assignment.courseID)) {
                return badRequestResponse('User Unauthorized For This Action', 403)
            }
            if (with_attempts === 'true') {
                const attempts = []
                for(const a of assignment.attempts){
                    const attempt = await attemptFromDynamo(a)
                    if(attempt === null) return badRequestResponse('Attempt listed in assignment that does not exist ')
                    attempts.push(attempt)
                }
                return successResponse({ assignment, attempts })
            } else {
                return successResponse({ assignment })
            }
        }
        if (course_id) {
            if (!adminPrivileges(user) && !user.courseIDs.includes(course_id)) {
                return badRequestResponse('User Unauthorized For This Action', 403)
            }
            const allAssignments = await allAssignmentsFromDynamo()
            const assignments = allAssignments.filter(assignment => assignment.courseID === course_id)
            if (with_attempts === 'true') {
                const attempts = new Array(0)
                assignments.forEach((assign) => {
                    for(const a of assign.attempts){
                        const attempt = attemptFromDynamo(a)
                        if(attempt === null) return badRequestResponse('Attempt listed in assignment that does not exist ')
                        attempts.push(attempt)
                    }
                })
                return successResponse({ assignments, attempts })
            }
            return successResponse({ assignments })
        }

        const assignments = await allAssignmentsFromDynamo()
        if (with_attempts === 'true') {
            const attempts = new Array(0)
            assignments.forEach((assign) => {
                for(const a of assign.attempts){
                    const attempt = attemptFromDynamo(a)
                    if(attempt === null) return badRequestResponse('Attempt listed in assignment that does not exist ')
                    attempts.push(attempt)
                }
            })
            return successResponse({ assignments, attempts })
        }
        return successResponse({ assignments })
    } catch (err) {
        return serverErrorResponse(err, 'getAssignmentsLogic')
    }
}

/**
 * Logic for deleting an assignment with a certain id
 * @param {Object} event The HTTP Request
 * @param {User} user The requesting user
 * @returns {Object} A success, bad request, or server error response
 */
type DeleteAssignmentsParam = { id: string[] }
export async function deleteAssignmentsLogic (event: APIGatewayProxyEvent, user: User): Promise<APIGatewayProxyResult> {
    // Get id from path parameters and make sure the assignment exists
    const { id } = event.multiValueQueryStringParameters as DeleteAssignmentsParam
    try {
        const assignments = []
        for(const i of id){
            // get assignment
            const assignment = await assignmentFromDynamo(i)
            if (assignment === null) return badRequestResponse('Assignment Not Found '+i)
            if (!adminPrivileges(user)) {
                // user is an instructor
                if (!user.courseIDs.includes(assignment.courseID)) {
                    return badRequestResponse('User Unauthorized For This Action', 403)
                }
            }

            // Delete the assignments and it attempts and return the assignment
            const allAttempts = await allAttemptsFromDynamo()
            const attempts = allAttempts.filter(attempt => attempt.assignmentID === i)
            attempts.forEach((a) => { deleteAttempt(a.id) })

            await deleteAssignment(assignment.id)
            assignments.push(assignment)
        }
        return successResponse({assignments})
    } catch (err) {
        return serverErrorResponse(err, 'deleteAssignmentsLogic')
    }
}

/**
 *
 * Logic for deleting attempts from a BRIEF App Assignment
 * @param {*} event The HTTP Request
 * @param {User} user The requesting user
 * @returns {Object} A success, bad request, or server error response
 */
type DeleteAssignmentAttemptsParam = { id: string[] }
export async function deleteAssignmentAttemptsLogic (event: APIGatewayProxyEvent, user: User): Promise<APIGatewayProxyResult> {
    // get id from path
    const { id } = event.multiValueQueryStringParameters as DeleteAssignmentAttemptsParam
    try {
        const attemptsDeleted = []
        attemptsDeleted.push(null)
        for(const i of id){
            // get assignment
            const assignment = await assignmentFromDynamo(i)
            if (assignment === null) return badRequestResponse('Assignment Not Found')
            if (!adminPrivileges(user)) {
                // user is an instructor or student
                if (!user.courseIDs.includes(assignment.courseID)) {
                    return badRequestResponse('User Unauthorized For This Action', 403)
                }
            }

            for(const a of assignment.attempts){
                if(!assignment.attempts) return successResponse({attemptsDeleted})
                const attempt = await attemptFromDynamo(a)

                if(attempt === null) return badRequestResponse('Attempt listed in assignment that does not exist ')

                if (!instructorPrivileges(user)) {
                    if (attempt.completed === 'false') {
                        deleteAttempt(a)
                    }
                } else {
                    deleteAttempt(a)
                }
                attemptsDeleted.push(attempt)
            }
        }
        return successResponse({ attemptsDeleted })
    } catch (err) {
        return serverErrorResponse(err, 'deleteAssignmentAttemptsLogic')
    }
}

/**
 * Logic for editing a BRIEF App Assignment
 * @param {Object} event HTTP Request
 * @param {User} user The requesting user
 * @returns {Object} A success or bad request response
 */
type EditAssignmentPathParams = {id:string}
type EditAssignmentBody = {name: string, description: string, assets?: any,
    minimumScore?: number, addQuestions?: any[], removeQuestions?: string[]}
export async function editAssignmentsLogic (event: APIGatewayProxyEvent, user: User) : Promise<APIGatewayProxyResult> {
    if (user.role !== 'Admin' && user.role !== 'Instructor') {
        return serverErrorResponse('Unauthorized', 'Student')
    }

    try {
        const payload: EditAssignmentBody = JSON.parse(event.body)

        const invalid = Assignment.verifyFields(payload)
        if (invalid) return badRequestResponse(invalid.error)

        const { id } = event.pathParameters as EditAssignmentPathParams
        const assignment: Assignment | null = await assignmentFromDynamo(id)
        if (!assignment) return badRequestResponse('Assignment Under Given ID Not Found', 404)

        assignment.name = payload.name
        assignment.description = [payload.description]
        if (payload.assets) assignment.assets = payload.assets
        if (payload.minimumScore) assignment.minimumScore = payload.minimumScore

        // Handle the addition of questions
        if (payload.addQuestions) {
            assignment.questions = [...assignment.questions, ...payload.addQuestions]
        }

        // Handle the removal of questions
        if (payload.removeQuestions) {
            assignment.questions = assignment.questions.filter(q => !payload.removeQuestions!.includes(q))
        }

        await addOrUpdateAssignment(assignment)
        return successResponse({ assignment })
    } catch (err) {
        return serverErrorResponse(err, 'editAssignmentLogic')
    }
}
