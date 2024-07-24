import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { badRequestResponse } from "../services/rest"
export const notFound = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
    badRequestResponse(`${event.httpMethod} /${event.path} Not Found`, 404)
