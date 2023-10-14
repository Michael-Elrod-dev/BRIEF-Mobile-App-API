import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Course, CoursePayload } from './course'
import { successResponse, badRequestResponse, serverErrorResponse } from '../../services/rest'
import { allCoursesFromDynamo, courseFromDynamo } from '../../services/fromDynamo'
import { generateId } from '../../services/general'
import { COURSE_TABLE } from '../../services/tables'
import { addOrUpdateCourse, deleteCourse } from '../../services/writeToDynamo'

/**
 * Logic for creating a BRIEF course
 * @param {Object} event HTTP Request
 * @returns {Object} A success or bad request response
 */
export async function createCourseLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const payload = event.body as unknown as CoursePayload
    // Make sure there are no required fields missing in the payload and the fields are valid
    const missing = Course.missingFields(payload)
    if (missing) return badRequestResponse(`Required Fields Missing: ${missing}`)
    const invalid = Course.verifyFields(payload)
    if (invalid) return badRequestResponse(invalid.error)

    // Generate ID for the course
    const id = await generateId(COURSE_TABLE, 'id', 25, { ModelClass: Course })
    payload.id = id

    // Create and add course to database, then return the course
    const course = new Course(payload)
    await addOrUpdateCourse(course)
    return successResponse({ course })
}

/*
 * Logic for editing a course
 * @param {Object} event The HTTP Request
 * @param {User} user The requesting user
 * @returns {Object} A success or bad request response
 */
type EditCoursesPathParams = { id:string }
type EditCourseBody = {courseNumber?:number, courseName?:string, type?:string, addInstructors?:string[],
    removeInstructors?:string[], addStudents?:string[], removeStudents?:string[]}
export async function editCoursesLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const payload: EditCourseBody = JSON.parse(event.body)

        // Verify the fields in the payload
        const invalid = Course.verifyFields(payload)
        if (invalid) return badRequestResponse(invalid.error)

        const { id } = event.pathParameters as EditCoursesPathParams
        const course: Course | null = await courseFromDynamo(id)
        if (!course) return badRequestResponse('Course Under Given ID Not Found', 404)

        // Update the course details
        course.courseNumber = payload.courseNumber || course.courseNumber
        course.courseName = payload.courseName || course.courseName

        // Handle the addition and removal of instructors and students
        if (payload.addInstructors) {
            course.instructors = [...course.instructors, ...payload.addInstructors]
        }
        if (payload.removeInstructors) {
            course.instructors = course.instructors.filter(i => !payload.removeInstructors!.includes(i))
        }
        if (payload.addStudents) {
            course.students = [...course.students, ...payload.addStudents]
        }
        if (payload.removeStudents) {
            course.students = course.students.filter(s => !payload.removeStudents!.includes(s))
            // Remove the student attempts for the course's assignments
            // for (const student of payload.removeStudents) {
            //     await deleteStudentAttemptsForCourseAssignments(student, id); // TODO: Implement this function
            // }
        }

        await addOrUpdateCourse(course)
        return successResponse({ course })
    } catch (err) {
        return serverErrorResponse(err, 'editCoursesLogic')
    }
}

/**
 * Logic for getting all courses
 * @returns {Object} A success response with the courses
 */
export async function getCoursesLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        const courses = await allCoursesFromDynamo()
        return successResponse({ courses })
    } catch (err) {
        return serverErrorResponse(err, 'getCoursesLogic')
    }
}

// /**
//  * Logic for getting a courses with a certain type
//  * @param {Object} event The HTTP Request
//  * @returns {Object} A success or bad request response
//  */
// type GetTypeCoursePathParam = {courseType:string}

// export async function getTypeCoursesLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
//     // get course type from path
//     const { courseType } = event.pathParameters as GetTypeCoursePathParam

//     // verify type from path
//     if (courseType == 'Science' || courseType == 'Technology' || courseType == 'Engineering' || courseType == 'Math') {} else {
//         return badRequestResponse('Type is invalid... Should be Science, Technology, Engineering or Math: ' + courseType)
//     }

//     try {
//         // get courses from database
//         const allCourses = await allCoursesFromDynamo()
//         const courses = allCourses.filter(course => course.type === courseType)
//         return successResponse({ courses })
//     } catch (err) {
//         return serverErrorResponse(err, 'getTypeCoursesLogic')
//     }
// }

// /**
//  * Logic for getting courses in a certain student
//  * @param {Object} event The HTTP Request
//  * @returns {Object} A success or bad request response
//  */
// type GetStudentCoursesPathParam = {pathEmail:string}

// export async function getStudentCoursesLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
//     // get suite email from path
//     const { pathEmail } = event.pathParameters as GetStudentCoursesPathParam
//     const courses = []

//     try {
//         // get course
//         const allCourses = await allCoursesFromDynamo()
//         for (let i = 0; i < allCourses.length; i++) {
//             for (let j = 0; j < allCourses[i].students.length; j++) {
//                 if (allCourses[i].students[j] === pathEmail) {
//                     courses.push(allCourses[i])
//                 }
//             }
//         }
//         return successResponse({ courses })
//     } catch (err) {
//         return serverErrorResponse(err, 'getStudentCoursesLogic')
//     }
// }

/**
 * Logic for deleting a courses with a certain id
 * @param {Object} event The HTTP Request
 * @returns {Object} A success or bad request response
 */
type DeleteCoursesPathParam = {pathId:string}

export async function deleteCoursesLogic (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    // get id from path
    // need to change to be a query param
    const { pathId } = event.pathParameters as DeleteCoursesPathParam

    try {
        const allCourses = await allCoursesFromDynamo()
        const courses = allCourses.filter(course => course.id === pathId)
        await deleteCourse(pathId)
        return successResponse({ courses })
    } catch (err) {
        return serverErrorResponse(err, 'deleteCoursesLogic')
    }
}
