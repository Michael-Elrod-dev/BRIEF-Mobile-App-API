import { APIGatewayProxyEvent } from 'aws-lambda'
import { getItem, deleteItemFromS3 } from './aws'
import { getPresignedUrl } from './axios'
import { validateMIMEString } from './regex'
type NLMAModel = { HASH_KEY?: { name:string, type:string }, RANGE_KEY?: { name:string, type:string } }

/**
 * Helper function generates a random variable length character string
 * @param {string} length (Optional, default is 25) The length of the string
 * @returns {string} A random string
 */
export const generateString = (length = 25) => {
    let res = ''
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return res
}

/**
 * Function generates a unique id for a given database table
 * @param {string} table The table to create the unique id for
 * @param {string} key The name of the key field of the table
 * @param {Number} length (Optional) The length of the id, defaults to 25
 * @return A unique id for the given table
 */
export const generateId = async (table: string, key: string, length = 25, { ModelClass }: { ModelClass?:NLMAModel } = {}) => {
    let id = ''
    const search: any = {}
    let hit = true
    while (hit) {
        id = generateString(length)
        search[key] = id
        hit = (await getItem(table, search, { ModelClass })).Item !== undefined
    }
    return id
}

// mapAsync and filterAsync found online. These are for async array filtering
// CODE FOR ASYNC ARRAY FILTERING SOURCED FROM https://stackoverflow.com/questions/33355528/filtering-an-array-with-a-function-that-returns-a-promise/53508547#53508547
function mapAsync (array: any[], callbackfn: any) {
    return Promise.all(array.map(callbackfn))
}

export const filterAsync = async (array: any[], callbackfn: any) => {
    const filterMap = await mapAsync(array, callbackfn)
    return array.filter((value, index) => filterMap[index])
}

/**
 * Helper function removes an item from an array
 * @param {Array} arr The array
 * @param {any} item The item
 */
export const removeItemFromArray = (arr: any[], item: any) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            arr.splice(i, 1)
            i = arr.length
        }
    }
}

/**
 * Helper function makes sure a passed in value is a valid url and turns it into one if it's not
 * @param {string} url The url
 * @returns A valid url
 */
export const makeUrl = (url: string) => {
    try {
        // eslint-disable-next-line no-new
        new URL(url)
        return url
    } catch (err) {
        return `https://${url}`
    }
}

export const getS3ObjectKeyFromUrl = (url: string):string => {
    try {
        const KEY_INDEX = 4
        url = decodeURIComponent(url.split('/').slice(KEY_INDEX).join('/').replaceAll('+', ' '))
        return url
    } catch (err) {
        return ''
    }
}

/**
 * Function generates and returns a presigned s3 url
 * @param {APIGatewayProxyEvent} event The http request
 * @param {string} contentType The content type of the file
 * @param {string} bucket Bucket the file is being uploaded to
 * @param {string} newFilename Name of the file being uploaded
 * @param {string} oldUrl Url of the old file to remove
 * @returns An error message, or a presigned url and the url of the file
 */
export const getPresignedUrlFromSuite = async (event: APIGatewayProxyEvent, contentType: string, bucketFolder: string, newFilename: string, oldUrl: string | null = null) => {
    // Make sure type is a valid MIME string
    if (!validateMIMEString(contentType)) return { error: 'Invalid type. Ex: image/png' }

    // Make the payload and send the request to the suite api, then return to the requesting user
    const suitePayload = {
        appName: process.env.APP_NAME,
        appKey: process.env.APP_KEY,
        filename: `${bucketFolder}/${newFilename}`,
        contentType
    }
    const res = await getPresignedUrl(event.headers.Authorization ?? '', suitePayload)
    if (res.error) return { ...res }

    if (oldUrl) await deleteItemFromS3(bucketFolder, getS3ObjectKeyFromUrl(oldUrl))

    return { presignedUrl: res.uploadUrl, url: res.uploadUrl.split('?')[0] }
}
