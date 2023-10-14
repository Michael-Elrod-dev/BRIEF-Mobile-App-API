/**
 * BRIEF App Course Model
 */
export type CoursePayload = {
    id: string
    courseNumber: number
    courseName: string
    instructors?: string[]
    students?: string[]
    type: string
}

type CourseRequired = {
    courseNumber?: number
    courseName?: string
    instructors?: string[]
    students?: string[]
    type?: string
}

export class Course {
    id: string
    courseNumber: number
    courseName: string
    instructors: string[]
    students: string[]
    type: string

    /**
     * Constructs a course
     * @param {Object} payload Payload containing course information
     */

    constructor (payload:CoursePayload) {
        this.id = payload.id
        this.courseNumber = payload.courseNumber
        this.courseName = payload.courseName
        this.instructors = payload.instructors ?? []
        this.students = payload.students ?? []
        this.type = payload.type
    }

    static HASH_KEY = { name: 'id', type: 'S' }

    /**
     * Function determines if a payload is missing required course information
     * @param {Object} payload Payload containing Courses information
     * @returns {String} Missing course fields
     */
    static missingFields (payload:CourseRequired) {
        let missing = ''
        missing += payload.courseNumber !== undefined ? '' : missing ? ', courseNumber' : 'courseNumber'
        missing += payload.courseName ? '' : missing ? ', courseName' : 'courseName'
        missing += payload.instructors ? '' : missing ? ', instructors' : 'instructors'
        missing += payload.students ? '' : missing ? ', students' : 'students'
        missing += payload.type ? '' : missing ? ', type' : 'type'
        return missing
    }

    /**
     * Function verifies fields in a given payload if they are present
     * @param {any} payload Object containing fields for the student model
     * @returns {Boolean | {error: String}} Returns an error message there are any invalid fields. Boolean if nothing invalid
     */
    static verifyFields (payload: any): false | {error: string} {
        const types = {
            string: ['courseNumber', 'courseName', 'type']
        }
        let error: boolean | {error: string} = false
        // check that fields passed in are the correct type
        for (const [key, value] of Object.entries(types)) {
            value.forEach(field => {
                const typeOfField = typeof (payload[field])
                // if field exists in payload and the type of payload is key
                if (typeOfField !== 'undefined' && typeOfField !== key && payload[field]) error = { error: `Invalid type of ${field}` }
            })
        }

        if (payload.type !== 'Science' && payload.type !== 'Technology' && payload.type !== 'Engineering' && payload.type !== 'Math') { error = { error: 'Type is invalid... Should be Science, Technology, Engineering or Math: ' + payload.type } }

        return error
    }
}
