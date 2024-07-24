import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { suiteSignInStepTwo } from '../../services/axios'
import { validateEmail } from '../../services/regex'
import { serverErrorResponse, preparePayload, badRequestResponse, successResponse } from '../../services/rest'
import { userFromDynamo } from '../../services/fromDynamo'
/**
 * Function signs a user in through PEO and returns secondary app tokens
 * Needs 2FA code and suite email
 * @param {Object} event The http request
 * @returns {Object} A success, bad request, or server error response
 */
type SignInStepTwoBody = {email:string, code:string}
export async function signInStepTwo (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
        // Make sure required payload fields are present and valid
        preparePayload(event)
        const { email, code } = event.body as unknown as SignInStepTwoBody
        if (!email || !code) return badRequestResponse('Required Field(s) Missing: email or code')
        if (!validateEmail(email)) return badRequestResponse('Invalid email')
        if (typeof code !== 'string') return badRequestResponse('Invalid code')

        // Request and return secondary app token information from the suite api
        const { sourceIp: ip } = event.requestContext.identity
        const payload = {
            email,
            code,
            ip,
            appName: process.env.APP_NAME,
            appKey: process.env.APP_KEY
        }
        const res = await suiteSignInStepTwo(payload)
        if (res.error) return badRequestResponse(res)

        const user = await userFromDynamo(email)
        if (!user) return badRequestResponse('User Under Given Email Not Found', 404)

        return successResponse({ ...res, user: { firstName: user.firstName, lastName: user.lastName, role: user.role } })
    } catch (err) {
        return serverErrorResponse(err)
    }
}
