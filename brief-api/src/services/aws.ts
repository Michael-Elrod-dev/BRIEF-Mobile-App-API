import { ApplicationAutoScaling } from '@aws-sdk/client-application-auto-scaling'
import { DynamoDBDocument, GetCommandOutput, PutCommandOutput, UpdateCommandOutput, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb'
import { DynamoDB, CreateTableInput, UpdateItemCommandInput, AttributeValue } from '@aws-sdk/client-dynamodb'
import { S3 } from '@aws-sdk/client-s3'

const CONFIG = { region: process.env.REGION }
const DYNAMO = DynamoDBDocument.from(new DynamoDB(CONFIG), { marshallOptions: { convertClassInstanceToMap: true } })
const s3 = new S3()
const DDB = new DynamoDB(CONFIG)
const SCALING = new ApplicationAutoScaling(CONFIG)

const Bucket = '' // TODO: Enter bucket name here (if applicable)
const READ_DIMENSIONS = 'dynamodb:table:ReadCapacityUnits'
const WRITE_DIMENSIONS = 'dynamodb:table:WriteCapacityUnits'
type NLMAModel = { HASH_KEY?: { name:string, type:string }, RANGE_KEY?: { name:string, type:string } }

async function dynamoRequest (func:() => any, table:string, ModelClass?:NLMAModel) {
    try {
        return await func()
    } catch (err:any) {
        if (!ModelClass || err.name !== 'ResourceNotFoundException') throw err
        // Create dynamo table
        await createDynamoTable(table, ModelClass)

        // Wait for the table to ACTUALLY be available
        let available = false
        while (!available) {
            try {
                (await DYNAMO.scan({ TableName: table, Limit: 1 }))
                available = true
            } catch (err:any) {
                if (err.name !== 'ResourceNotFoundException') throw err
            }
        }

        // Re-run logic
        return await func()
    }
}

export async function createDynamoTable (table:string, ModelClass:NLMAModel = {}) {
    const params: CreateTableInput = {
        TableName: table,
        AttributeDefinitions: [],
        KeySchema: [],
        BillingMode: 'PROVISIONED',
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    }

    if (ModelClass.HASH_KEY) {
        params.AttributeDefinitions!.push({ AttributeName: ModelClass.HASH_KEY.name, AttributeType: ModelClass.HASH_KEY.type })
        params.KeySchema!.push({ AttributeName: ModelClass.HASH_KEY.name, KeyType: 'HASH' })
    } else throw Error('createTable - ModelClass Missing HASH_KEY')

    if (ModelClass.RANGE_KEY) {
        params.AttributeDefinitions!.push({ AttributeName: ModelClass.RANGE_KEY.name, AttributeType: ModelClass.RANGE_KEY.type })
        params.KeySchema!.push({ AttributeName: ModelClass.RANGE_KEY.name, KeyType: 'RANGE' })
    }

    let otherProcessCreatingTable = false
    try {
        // Try to create the table
        await DDB.createTable({ ...params })
    } catch (err:any) {
        // If failed and the code isn't a ResourceInUseException, exit the function
        otherProcessCreatingTable = err.name === 'ResourceInUseException'
        if (!otherProcessCreatingTable) throw err
    }

    let tableInfo = await DDB.describeTable({ TableName: table })
    if (!tableInfo.Table) throw Error(`createTable - Failed To Create ${table}`)

    while (tableInfo.Table!.TableStatus === 'CREATING') tableInfo = await DDB.describeTable({ TableName: table })

    // If another process is creating the table, let it handle adding auto scaling if it's needed
    if (!otherProcessCreatingTable) {
        const parts = table.split('-')
        if (parts[parts.length - 1] === 'prod') {
            // Create prod scalable targets
            await SCALING.registerScalableTarget(
                { ResourceId: `table/${table}`, ScalableDimension: READ_DIMENSIONS, ServiceNamespace: 'dynamodb', MinCapacity: 1, MaxCapacity: 10 }
            )
            await SCALING.registerScalableTarget(
                { ResourceId: `table/${table}`, ScalableDimension: WRITE_DIMENSIONS, ServiceNamespace: 'dynamodb', MinCapacity: 1, MaxCapacity: 10 }
            )

            // Create prod scalable target policies
            await SCALING.putScalingPolicy(
                { ResourceId: `table/${table}`, PolicyName: `$${table}-scaling-policy`, ServiceNamespace: 'dynamodb', ScalableDimension: READ_DIMENSIONS, PolicyType: 'TargetTrackingScaling', TargetTrackingScalingPolicyConfiguration: { TargetValue: 70, PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBReadCapacityUtilization' } } }
            )
            await SCALING.putScalingPolicy(
                { ResourceId: `table/${table}`, PolicyName: `$${table}-scaling-policy`, ServiceNamespace: 'dynamodb', ScalableDimension: WRITE_DIMENSIONS, PolicyType: 'TargetTrackingScaling', TargetTrackingScalingPolicyConfiguration: { TargetValue: 70, PredefinedMetricSpecification: { PredefinedMetricType: 'DynamoDBWriteCapacityUtilization' } } }
            )
        }
    }
    return tableInfo
}

/**
 * Function gets all the items from a given table
 * @param {string} table The table to get the items from
 * @returns The items from the database
 */
export async function getAll (table: string, { ModelClass }: { ModelClass?:NLMAModel } = {}):Promise<any[]> {
    const handler = async () => {
        const params = {
            TableName: table
        }
        return (await DYNAMO.scan(params)).Items ?? []
    }
    return dynamoRequest(handler, table, ModelClass)
}

/**
 * Function gets an item from the given table using a given key. If an object class (objClass) is given
 * then the function will return null if the item doesn't exist, or an object of objClass if the item does exist.
 * If objClass is null, the function returns a promise
 *
 * @param {string} table The table to get the item from
 * @param {object} key What to look for in an object with the partition (and sort) key. Ex {email: "email"} if looking for a user
 * @returns The get item output https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/getitemoutput.html
 */
export function getItem (table: string, key: object, { ModelClass }: { ModelClass?:NLMAModel } = {}):Promise<GetCommandOutput> {
    const handler = () => {
        const params = {
            TableName: table,
            Key: key
        }
        return DYNAMO.get(params)
    }
    return dynamoRequest(handler, table, ModelClass)
}

/**
 * Function adds or updates an item.
 * UPDATING OVERWRITES THE ENTIRE ITEM, MAKE SURE THE ITEM IS
 * 100% CORRECT BEFORE CALLING THIS FUNCTION
 * @param {string} table The table to add the item to
 * @param {object} item The item to add
 * @returns The output of the put https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/putitemoutput.html
 */
export function addOrUpdateItem (table: string, item: object, { ModelClass }: { ModelClass?:NLMAModel } = {}):Promise<PutCommandOutput> {
    const handler = () => {
        const params = {
            TableName: table,
            Item: item
        }
        return DYNAMO.put(params)
    }
    return dynamoRequest(handler, table, ModelClass)
}

/**
 * Function updates an item.
 * @param {string} table The table to update the item in
 * @param {{[x:string]: string}} key The key of the item being updated
 * @param {{[x:string]: any}} set The fields and values to add/update in the item
 * @param {string[]} remove The fields to remove from the item
 * @returns The output of the update https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/UpdateItemCommand/
 */
export function updateItem (table: string, key: {[x:string]: AttributeValue}, set: {[x:string]: any} = {}, remove:string[] = [], { ModelClass }: { ModelClass?:NLMAModel } = {}):Promise<UpdateCommandOutput> {
    const handler = () => {
        let UpdateExpression = ''
        const ExpressionAttributeValues:Record<string, AttributeValue> = {}

        for (let i = 0; i < remove.length; i++) {
            if (typeof remove[i] !== 'string') throw new Error('updateItem - All Items In remove Must Be Strings')
            const field = remove[i]
            if (i === 0) UpdateExpression = `REMOVE ${field}`
            else UpdateExpression += `, ${field}`
        }

        const pairs = Object.entries(set)
        for (let i = 0; i < pairs.length; i++) {
            const [field, value] = pairs[i]
            if (i === 0) UpdateExpression += UpdateExpression ? ` SET ${field} = :${field}` : `SET ${field} = :${field}`
            else UpdateExpression += `, ${field} = :${field}`
            ExpressionAttributeValues[`:${field}`] = value
        }

        const params:UpdateItemCommandInput = {
            TableName: table,
            Key: key,
            UpdateExpression,
            ExpressionAttributeValues
        }
        if (pairs.length === 0) delete params.ExpressionAttributeValues

        return DYNAMO.update(params)
    }
    return dynamoRequest(handler, table, ModelClass)
}

/**
 * Function deletes an item from a given table under a given key
 * @param {string} table The table to delete the item from
 * @param {object} key What to look for in an object with the partition (and sort) key. Ex {email: "email"} if looking for a user
 * @returns The output of the put https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/deleteitemoutput.html
 */
export function deleteItem (table: string, key: object, { ModelClass }: { ModelClass?:NLMAModel } = {}):Promise<DeleteCommandOutput> {
    const handler = () => {
        const params = {
            TableName: table,
            Key: key
        }
        return DYNAMO.delete(params)
    }
    return dynamoRequest(handler, table, ModelClass)
}

/**
 * Function removes an item from a given s3 bucket
 * @param {string} folder The bucket folder
 * @param {string} key The name of the item to delete
 * @returns A promise containing whether or not this item was deleted from the bucket
 */
export function deleteItemFromS3 (folder: string, key: string) {
    const params = {
        Bucket,
        Key: `${folder}/${key}`
    }
    return s3.deleteObject(params)
}

/**
 * Function removes all items from a given s3 bucket folder, therefore deleting the entire folder
 * @param {string} folderKey The bucket folder (including a / at the end)
 */
export async function deleteS3BucketFolder (folderKey: string) {
    const listParams = {
        Bucket,
        Prefix: folderKey
    }

    const listedObjects = await s3.listObjectsV2(listParams)
    if (listedObjects.Contents?.length === 0) return

    const deleteParams: any = {
        Bucket,
        Delete: { Objects: [] }
    }

    listedObjects.Contents?.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key })
    })

    await s3.deleteObjects(deleteParams)

    if (listedObjects.IsTruncated) await deleteS3BucketFolder(folderKey)
}

/**
 * Function copies a source object to a given key location
 * @param {string} source Key of the source object
 * @param {string} key Key of the new object
 * @returns A promise containing whehter or not the copy was created
 */
export function copyS3Item (source: string, key: string) {
    const params = {
        Bucket,
        CopySource: source,
        Key: key
    }
    return s3.copyObject(params)
}
