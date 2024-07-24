/**
 * BRIEF App User Model
 */
export type UserPayload = {
    suiteEmail:string
    firstName:string
    lastName: string
    role: string
    courseIDs?: string[]
}

type UserRequired = {
    role?: string
}

export class User {
    suiteEmail:string
    firstName:string
    lastName: string
    role: string
    courseIDs: string[]

    /**
     * Constructs a user
     * @param {Object} payload Payload containing user information
     */
    constructor (payload:UserPayload) {
        this.suiteEmail = payload.suiteEmail
        this.firstName = payload.firstName
        this.lastName = payload.lastName
        this.role = payload.role
        this.courseIDs = payload.courseIDs ?? []
    }

    static HASH_KEY = { name: 'suiteEmail', type: 'S' }

    /**
     * Function determines if a payload is missing required user information
     * @param {Object} payload Payload containing user information
     * @returns {String} Missing user fields
     */
    static missingFields (payload:UserRequired) {
        let missing = ''
        missing += payload.role ? '' : missing ? ', role' : 'role'
        return missing
    }

    /**
     * Function verifies fields in a given payload if they are present
     * @param {any} payload Object containing fields for the user model
     * @returns {Boolean | {error: String}} Returns an error message there are any invalid fields. Boolean if nothing invalid
     */
    static verifyFields (payload: any): false | {error: string} {
        const types = {
            string: ['role']
        }
        let error: boolean | {error: string} = false
        // check that fields passed in are the correct type
        for (const [key, value] of Object.entries(types)) {
            value.forEach(field => {
                const typeOfField = typeof (payload[field])
                // if field exists in payload and the type of payload is key
                if (typeOfField !== 'undefined' && typeOfField !== key && payload[field]) { error = { error: `Invalid type of ${field}` } }
            })
        }
        return error
    }
}
