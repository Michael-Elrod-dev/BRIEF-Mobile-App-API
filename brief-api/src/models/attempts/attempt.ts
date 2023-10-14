/**
 * BRIEF App Attempt Model
 */
export type AttemptPayload = {
    id: string
    suiteEmail: string
    assignmentID: string
    score: number
    completed: string
}

type AttemptRequired = {
    suiteEmail?: string
    assignmentID?: string
}

export class Attempt {
    id: string
    suiteEmail: string
    assignmentID: string
    score: number
    completed: string

    /**
     * Constructs an attempt
     * @param {Object} payload Payload containing attempt information
     */

    constructor (payload:AttemptPayload) {
        this.id = payload.id
        this.suiteEmail = payload.suiteEmail
        this.assignmentID = payload.assignmentID
        this.score = payload.score
        this.completed = payload.completed
    }

    static HASH_KEY = { name: 'id', type: 'S' }

    /**
     * Function determines if a payload is missing required attempt information
     * @param {Object} payload Payload containing attempts information
     * @returns {String} Missing attempt fields
     */
    static missingFields (payload:AttemptRequired) {
        let missing = ''
        missing += payload.suiteEmail ? '' : missing ? ', suiteEmail' : 'suiteEmail'
        missing += payload.assignmentID ? '' : missing ? ', assignmentID' : 'assignmentID'
        return missing
    }

    /**
     * Function verifies fields in a given payload if they are present
     * @param {any} payload Object containing fields for the attempt model
     * @returns {Boolean | {error: String}} Returns an error message there are any invalid fields. Boolean if nothing invalid
     */
    static verifyFields (payload: any): false | {error: string} {
        const types = {
            string: ['suiteEmail', 'assignmentID']
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
