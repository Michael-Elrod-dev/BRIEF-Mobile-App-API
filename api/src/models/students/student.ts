/**
 * BRIEF App Student Model
 */
export type StudentPayload = {
    suiteEmail: string
    assignmentIDs?: string []
    attemptIDs?: string[]
    mastery?: number
}

type StudentRequired = {
    suiteEmail?: string
}

export class Student {
    suiteEmail: string
    assignmentIDs: string []
    attemptIDs: string[]
    mastery: number

    /**
     * Constructs a student
     * @param {Object} payload Payload containing student information
     */

    constructor (payload:StudentPayload) {
        this.suiteEmail = payload.suiteEmail
        this.assignmentIDs = payload.assignmentIDs ?? []
        this.attemptIDs = payload.attemptIDs ?? []
        this.mastery = payload.mastery ?? 0
    }

    static HASH_KEY = { name: 'suiteEmail', type: 'S' }

    /**
     * Function determines if a payload is missing required student information
     * @param {Object} payload Payload containing Students information
     * @returns {String} Missing student fields
     */
    static missingFields (payload:StudentRequired) {
        let missing = ''
        missing += payload.suiteEmail ? '' : missing ? ', suiteEmail' : 'suiteEmail'
        return missing
    }

    /**
     * Function verifies fields in a given payload if they are present
     * @param {any} payload Object containing fields for the student model
     * @returns {Boolean | {error: String}} Returns an error message there are any invalid fields. Boolean if nothing invalid
     */
    static verifyFields (payload: any): false | {error: string} {
        const types = {
            string: ['suiteEmail']
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
        return error
    }
}
