import axios from 'axios'
const API_URL = 'https://api.suite.stemrocks.net'

/**
 * Function sends a request to the Suite API to create a push notification
 * @param {string[]} emails Emails to send this data to
 * @param {Object} data The data to send
 * @returns {any} Axios response from Suite API
 */
export const sendSocketMessage = async (emails: string[], data: object) => {
    const payload = {
        emails,
        data,
        appName: process.env.APP_NAME,
        appKey: process.env.APP_KEY
    }

    return await performRequest(axios, {
        method: 'post',
        url: API_URL + '/socket',
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * Function sends a request to the Suite API to create a push notification
 * @param {string} id Id of the notification
 * @param {object} payload Request body
 * @param {string} auth Bearer auth token
 * @returns {any} Axios response from Suite API
 */
export const removeRecipientsFromPushNotification = async (id: string, payload: object, auth: string) => {
    return await performRequest(axios, {
        method: 'put',
        url: API_URL + `/notifications/${id}/recipients/remove`,
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth
        }
    })
}

/**
 * Function sends a request to the Suite API to create a push notification
 * @param {string} id Id of the notification
 * @param {object} payload Request body
 * @param {string} auth Bearer auth token * @returns {any} Axios response from Suite API
 */
export const addRecipientsToPushNotification = async (payload: object, auth: string, id: string) => {
    return await performRequest(axios, {
        method: 'put',
        url: API_URL + `/notifications/${id}/recipients`,
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth
        }
    })
}

/**
 * Function sends a request to the Suite API to create a push notification
 * @param {Object} payload Request body
 * @returns {any} Axios response from Suite API
 */
exports.getPushNotification = async (payload:any, auth:string) => {
    return await performRequest(axios, {
        method: 'post',
        url: API_URL + '/notifications/get',
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth
        }
    })
}

/**
 * Function sends a request to the Suite API to create a push notification
 * @param {string} id Id of the notification
 * @param {object} payload Request body
 * @param {string} auth Bearer auth token * @returns {any} Axios response from Suite API
 */
export const editPushNotification = async (id: string, payload: object, auth: string) => {
    return await performRequest(axios, {
        method: 'put',
        url: API_URL + `/notifications/${id}`,
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth
        }
    })
}

/**
 * Function sends a request to the Suite API to create a push notification
 * @param {object} payload Request body
 * @param {string} auth Bearer auth token * @returns {any} Axios response from Suite API
 * @returns {any} Axios response from Suite API
 */
export const deletePushNotification = async (payload: object, auth: string) => {
    return await performRequest(axios, {
        method: 'post',
        url: API_URL + '/notifications/delete',
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth
        }
    })
}

/**
 * Function sends a request to the Suite API to create a push notification
 * @param {object} payload Request body
 * @param {string} auth Bearer auth token * @returns {any} Axios response from Suite API
 * @returns {any} Axios response from Suite API
 */
export const createPushNotification = async (payload: object, auth: string) => {
    return await performRequest(axios, {
        method: 'post',
        url: API_URL + '/notifications',
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Authorization: auth
        }
    })
}

/**
 * Function sends a request to the Suite API to confirm a users Robotics TIPS account creation
 * @param {object} payload Request body
 * @returns {any} Axios response from Suite API
 */
export const confirmUser = async (payload: object) => {
    return await performRequest(axios, {
        method: 'post',
        url: API_URL + '/confirm',
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * Function sends a request to the Suite API to create a new suite user
 * @param {object} payload Request body
 * @returns {any} Axios response from Suite API
 */
export const createNewSuiteUser = async (payload: object) => {
    return await performRequest(axios, {
        method: 'post',
        url: API_URL + '/users',
        data: payload,
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * Function sends a request to the Sutie API to add an app to an existing user.
 * @param {object} payload Request body
 * @param {any} headers Request headers containing the admin's authorization token
 * @returns {any} Axios response from Suite API
 */
export const adminCreateUser = async (payload: object, headers: any) => {
    return await performRequest(axios, {
        method: 'put',
        url: API_URL + '/users/app',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${headers.Authorization}`
        },
        data: payload,
        responseType: 'json'
    })
}

/**
 * Function sends a request to the Suite API to get a users decrypted token
 * @param {String} encryptedToken Users JWT token
 * @returns {any} Axios response from Suite API
 */
export const getDecryptedToken = async (encryptedToken: string) => {
    return await performRequest(axios, {
        method: 'get',
        url: API_URL + '/auth/secondary',
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${encryptedToken}`
        }
    })
}

/**
 * Function to remove an app from a user in the suite api
 * @param {String} token Users encrypted token
 * @returns {any} Axios response from Suite API
 */
export const suiteDeleteUser = async (token: string, email: string | null = null) => {
    const payload: any = {
        appName: process.env.APP_NAME,
        appKey: process.env.APP_KEY
    }
    if (email) {
        payload.email = email
    }

    return performRequest(axios, {
        method: 'post',
        url: API_URL + '/users/app/remove',
        responseType: 'json',
        data: payload,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        }
    })
}

/**
 * Function to get a presigned s3 url from the suite api
 * @param {String} token Users encrypted token
 * @param {Object} payload Payload containing app and file information
 * @returns {any} Axios response from Suite API
 */
export const getPresignedUrl = async (token: string, payload: object) => {
    return performRequest(axios, {
        method: 'post',
        url: API_URL + '/images',
        responseType: 'json',
        data: payload,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
        }
    })
}

/**
 * Function to refresh a users secondary app access token
 * @param {String} token User refresh token (original header from request)
 * @param {Object} payload Payload containing app information
 * @returns {any} Axios response from Suite API
 */
export const refreshUserToken = async (token: string, payload: object) => {
    return performRequest(axios, {
        method: 'post',
        url: API_URL + '/auth/refresh',
        responseType: 'json',
        data: payload,
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }
    })
}

/**
 * Function to scheduled an email with the auth suite
 * @param {String} token User refresh token (original header from request)
 * @param {Object} payload Payload containing app information
 * @returns {any} Axios response from Suite API
 */
export const createScheduledEmail = async (payload: object) => {
    const req = {
        method: 'post',
        url: API_URL + '/emails',
        responseType: 'json',
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return performRequest(axios, req)
}

/**
 * Function to scheduled an email with the auth suite
 * @param {Object} payload Payload containing login information
 * @returns {any} Axios response from Suite API
 */
export const suiteSignInStepOne = async (payload:any, ip:string) => {
    const req = {
        method: 'post',
        url: API_URL + '/auth',
        responseType: 'json',
        data: { ...payload, ip, appName: process.env.APP_NAME as string, appKey: process.env.APP_KEY as string },
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return performRequest(axios, req)
}

/**
 * Function to sign a user in and retrieve their secondary app tokens
 * @param {Object} payload Payload containing login information
 * @returns {any} Axios response from Suite API
 */
export const suiteSignInStepTwo = async (payload: object) => {
    return performRequest(axios, {
        method: 'post',
        url: API_URL + '/2fa',
        responseType: 'json',
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * Function sends a request to Suite API Auth V2 to verify a users tokens/session
 * @param {String} auth Bearer token information
 * @returns {any} Axios response from Suite API
 */
export const v2VerifyTokens = async (auth: string) => {
    return await performRequest(axios, {
        method: 'post',
        url: API_URL + '/auth/verify',
        data: { appName: process.env.APP_NAME as string, appKey: process.env.APP_KEY as string },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth}`
        }
    })
}

/**
 * Helper function performs an axios request and returns the response data or error
 * @param {Function} req Function that returns an Axios Response
 * @param {any} args Function arguments
 * @returns {any} Response data or Response Error
 */
async function performRequest (req: Function, args: object) {
    try {
        const res = await req(args)
        return res.data
    } catch (err: any) {
        return err.response.data
    }
}
