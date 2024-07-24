import { User } from '../models/users/user'
import { v2VerifyTokens } from './axios'
import { userFromDynamo } from './fromDynamo'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export type DecryptedTokenType = {
    app?: string,
    email?: string,
    admin?: boolean,
    serverAdmin?: boolean
}

type checkAuthorizationType = {
    error?: string
    code?: number
    badRequest?: APIGatewayProxyResult
    user?: User
    decryptedToken?: DecryptedTokenType
    accessToken?: string | null
    refreshToken?: string | null
}

/**
 * Function checks a request Authorization Header and returns the User and decrypted token if
 * the bearer token is valid or an error
 * @param {String} auth HTTP Request Authorization Header
 * @returns {Promise<{error: Object, code: Number, badRequest: Object} | {error: Object, badRequest: Object} | {user: User, decryptedToken: Object}>}
 */
export async function checkAuthorization (event: APIGatewayProxyEvent): Promise<checkAuthorizationType> {
    // Make sure Bearer token was passed in
    const auth = event.headers.Authorization ?? ''
    const splitAuth = auth.split(' ')
    if (splitAuth.length !== 2) return { error: 'Bearer Authorization Required', code: 401, badRequest: badRequestResponse('Bearer Authorization Required', 401) }
    if (splitAuth[0] !== 'Bearer') return { error: 'Authorization must be "Bearer <ACCESS_TOKEN>;<REFRESH_TOKEN>"', code: 401, badRequest: badRequestResponse('Authorization must be "Bearer <ACCESS_TOKEN>;<REFRESH_TOKEN>"', 401) }
    const tokens = splitAuth[1]
    const splitTokens = tokens.split(';')
    if (splitTokens.length !== 2) return { error: 'Authorization must be "Bearer <ACCESS_TOKEN>;<REFRESH_TOKEN>"', code: 401, badRequest: badRequestResponse('Authorization must be "Bearer <ACCESS_TOKEN>;<REFRESH_TOKEN>"', 401) }

    // Try to decrypt the token, if it fails then the token is invalid
    const res = await v2VerifyTokens(tokens)
    if (res.error) return { ...res, badRequest: badRequestResponse(res.error) }
    const decryptedToken = res.token
    if (decryptedToken.serverAdmin) return { decryptedToken }
    const user = await userFromDynamo(decryptedToken.email)
    if (!user) return { error: 'User Not Found', badRequest: badRequestResponse('User Not Found'), decryptedToken }

    const toReturn: checkAuthorizationType = { user, decryptedToken, accessToken: null, refreshToken: null }
    // If access token is in the response, both access and refresh tokens are in the response
    if (res.accessToken) {
        toReturn.accessToken = res.accessToken
        toReturn.refreshToken = res.refreshToken
    }
    return toReturn
}

/**
 * Helper function turns the string version of the event body into an object
 * @param {APIGatewayProxyEvent} event The http request
 */
export function preparePayload (event: APIGatewayProxyEvent) {
    // Make payload an object since it starts as a string
    const retPayload = event.body ? JSON.parse(event.body) : {}
    // If there's an email in the payload and it's a string, make it all lowercase
    if (retPayload.email) {
        if (typeof retPayload.email === 'string') retPayload.email = retPayload.email.toLowerCase()
    }

    // Trim all strings
    for (const [key, value] of Object.entries(retPayload)) {
        // console.log(key,value)
        if (typeof value === 'string' && key !== 'text' && key !== 'overview' && key !== 'body') retPayload[key] = value.trim()
    }

    event.body = retPayload
}

/**
 * Helper function turns query string parameter keys that are hyphenated into camel case
 * @param {APIGatewayProxyEvent} event The http request
 */
export function prepareQueryStringParameters (event: APIGatewayProxyEvent) {
    const replacementQueryStringParameters: any = {}
    const params = Object.entries(event.queryStringParameters ?? {})
    for (const [key, value] of params) {
        const splitKey = key.split('-')
        let camelCaseKey = splitKey[0]
        for (let j = 1; j < splitKey.length; j++) {
            const keyChars = splitKey[j].split('')
            keyChars[0] = keyChars[0].toUpperCase()
            camelCaseKey += keyChars.join('')
        }
        replacementQueryStringParameters[camelCaseKey] = value
    }
    event.queryStringParameters = replacementQueryStringParameters
}

/**
 * Helper function generates a code 200 response
 * @param {any} message Key value pair of the success response
 * @returns The http response
 */
export function successResponse (message:any = null) {
    const response:APIGatewayProxyResult = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        },
        body: JSON.stringify(message)
    }
    return response
}

/**
 * Helper function generates a code 400 response
 * @param {String} error The error message
 * @returns The http response
 */
export function badRequestResponse (err: any, code = 400) {
    // Make sure code is in the bad request range if the default is changed
    code = !(code >= 400 && code <= 499) ? 400 : code

    const response: APIGatewayProxyResult = {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        },
        body: JSON.stringify({ error: err })
    }
    return response
}

/**
 * Helper function generates a code 500 response
 * @param {String} err The error message
 * @returns The http response
 */
export function serverErrorResponse (err: any, functionName = '') {
    const response: APIGatewayProxyResult = {
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        },
        body: JSON.stringify({ error: `Internal Server Error: ${functionName ? `${functionName} - ` : ''}${err}` })
    }
    return response
}
