/**
 * Function checks strings to see if they are a valid email
 * @param {string} email The email address to be checked if it is a valid email address
 * @returns true if is a valid email format
 */
export const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) !== null
}

/**
 * Checks if the string is a valid username
 * @param {string} password The password to be checked to meet all requirments
 * @returns true if is a valid password format
 */
export const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.*\d)[a-zA-Z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/.test(password)
}

/**
 * Checks if a phone number is formatted like a valid US phone number EX: (xxx) xxx-xxxx
 * @param {String} number The number to be checked
 * @returns Whether or not the number is formatted correctly
 */
export const validatePhoneNumber = (number: string) => {
    return /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/.test(number)
}

/**
 * Checks if the string is a valid name
 * @param {String} name The name to be checked to make sure it only contains letters hyphons and apostrophes
 * @returns True if it meets the criteria
 */
export const checkName = (name: string) => {
    return /^[A-Za-z'-]+$/.test(name)
}

/**
 * Checks if the string has a valid link
 * @param {string} link The link to validate
 * @returns Whether or not the link is valid
 */
export const validateLink = (link: string) => {
    let valid = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(link)
    if (!valid) {
        try {
            const url = new URL(link)
            valid = url.protocol === 'https:' || url.protocol === 'http:'
        } catch (err) {
            valid = false
        }
    }
    return valid
}

/**
 * Checks if a number is positive
 * @param {Number} num The number to validate
 * @returns Whether or not the number is valid
 */
export const validateNumber = (num: number) => {
    return num >= 0
}

/**
 * Checks if the string has a valid state abbreviation
 * @param {string} abbr The state to validate
 * @returns Whether or not the state is valid
 */
export const validateStateAbbreviation = (abbr: string) => {
    return /^[A-Z]{2}$/.test(abbr)
}

/**
 * Checks if the string has a valid zip code (90210 OR 90210-9000)
 * @param {string} zip The state to validate
 * @returns Whether or not the state is valid
 */
export const validateZipCode = (zip: string) => {
    return /^\d{5}$/.test(zip) || /^\d{5}-\d{4}$/.test(zip)
}

/**
 * Checks if the string has a valid 12 hour time (ex 1:00 PM)
 * @param {string} time The time to validate
 * @returns Whether or not the time is valid
 */
export const validate12HourTime = (time: string) => {
    return /^\d{1,2}:\d{2} (PM|AM)$/.test(time.toUpperCase())
}

/**
 * Checks if the string has a valid mime string (ex image/png)
 * @param {string} mime The mime to validate
 * @returns Whether or not the mime is valid
 */
export const validateMIMEString = (mime: string) => {
    return /^\w+\/[-+.\w]+$/.test(mime)
}
