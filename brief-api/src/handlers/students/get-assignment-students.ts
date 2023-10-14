import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import { getAssignmentStudentsLogic } from "../../models/student/studentLogic"
import { serverErrorResponse, checkAuthorization, badRequestResponse } from '../../services/rest'
import { getAssignmentStudentsLogic } from '../../models/students/studentLogic'
/**
 * Function gets all students
 * @param {Object} event The HTTP Request
 * @returns {Object} A success, bad request, or server error response
 */
export async function getAssignmentStudents (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        /*
        // Make sure event has valid auth bearer token
        const auth = await checkAuthorization(event)
        if(auth.error) return badRequestResponse(auth.error, auth.code ?? 400)
        if(!auth.user) return badRequestResponse('User Not Found')
        */
        return await getAssignmentStudentsLogic(event)
    } catch (err) {
        return serverErrorResponse(err)
    }
}
