import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DecryptedTokenType, checkAuthorization, preparePayload, prepareQueryStringParameters, serverErrorResponse } from './rest'
import { User } from '../models/users/user'

export type NLMAHandlerParams = {
    event: APIGatewayProxyEvent
    user?: User
    decryptedToken?: DecryptedTokenType
    [x:string]: any
}

export type AuthWrapperParams = {
    event: APIGatewayProxyEvent
    user: User
    decryptedToken?: DecryptedTokenType
    [x:string]: any
}

export type OptionalAuthWrapperParams = {
    event: APIGatewayProxyEvent
    user?: User
    decryptedToken?: DecryptedTokenType
    [x:string]: any
}

export type NoAuthWrapperParams = {
    event: APIGatewayProxyEvent
    [x:string]: any
}

export async function authWrapper (event: APIGatewayProxyEvent, handler: (x: NLMAHandlerParams) => Promise<APIGatewayProxyResult>, ...params: any[]): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        prepareQueryStringParameters(event)

        const { badRequest, user, decryptedToken, accessToken, refreshToken } = await checkAuthorization(event)
        if (badRequest) return badRequest

        const res = await handler({ event, user, decryptedToken, ...params })

        if (accessToken || refreshToken) {
            const bodyCopy = JSON.parse(res.body)
            if (accessToken) bodyCopy.accessToken = accessToken
            if (refreshToken) bodyCopy.refreshToken = refreshToken
            res.body = JSON.stringify(bodyCopy)
        }

        return res
    } catch (err) {
        return serverErrorResponse(err, 'authWrapper')
    }
}

export async function noAuthWrapper (event: APIGatewayProxyEvent, handler: (x: NLMAHandlerParams) => Promise<APIGatewayProxyResult>, ...params: any[]): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        prepareQueryStringParameters(event)

        return await handler({ event, ...params })
    } catch (err) {
        return serverErrorResponse(err, 'noAuthWrapper')
    }
}

export async function optionalAuthWrapper (event: APIGatewayProxyEvent, handler: (x: NLMAHandlerParams) => Promise<APIGatewayProxyResult>, ...params: any[]): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        prepareQueryStringParameters(event)

        const { user, decryptedToken, accessToken, refreshToken } = await checkAuthorization(event)

        const res = await handler({ event, user, decryptedToken, ...params })

        if (accessToken || refreshToken) {
            const bodyCopy = JSON.parse(res.body)
            if (accessToken) bodyCopy.accessToken = accessToken
            if (refreshToken) bodyCopy.refreshToken = refreshToken
            res.body = JSON.stringify(bodyCopy)
        }

        return res
    } catch (err) {
        return serverErrorResponse(err, 'optionalAuthWrapper')
    }
}
