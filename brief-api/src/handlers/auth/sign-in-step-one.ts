import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { suiteSignInStepOne } from '../../services/axios'
import { userFromDynamo } from '../../services/fromDynamo'
import { validateEmail, validatePassword } from '../../services/regex'
import { badRequestResponse, preparePayload, serverErrorResponse, successResponse } from '../../services/rest'

type SignInStepOneBody = { email:string, password: string, remember: boolean,
    firebaseMessagingToken:string }

export async function signInStepOne (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        preparePayload(event)
        const { email, password, remember, firebaseMessagingToken } = event.body as unknown as SignInStepOneBody
        if (!email || !password) return badRequestResponse('Required Fields Missing: email or password')
        if (!validateEmail(email)) return badRequestResponse('Invalid email')
        if (!validatePassword(password)) return badRequestResponse('Invalid password')
        if (remember !== undefined) {
            if (typeof remember !== 'boolean') return badRequestResponse('Invalid remember. Must be a boolean')
        }
        if (firebaseMessagingToken) {
            if (typeof firebaseMessagingToken !== 'string') return badRequestResponse('Invalid firebaseMessagingToken. Must be a string')
        }

        // Request and return secondary app token information from the suite api
        const { sourceIp: ip } = event.requestContext.identity
        const payload = { email, password, remember, firebaseMessagingToken, v2: true }
        const res = await suiteSignInStepOne(payload, ip)
        if (res.error) return badRequestResponse(res)

        if (res.accessToken && res.refreshToken) {
            const user = await userFromDynamo(email)
            if (!user) return badRequestResponse('User Under Given Email Not Found', 404)

            return successResponse({ ...res, user: { firstName: user.firstName, lastName: user.lastName, role: user.role } })
        }

        return successResponse(res)
    } catch (err) {
        return serverErrorResponse(err, 'signInStepOne')
    }
}
