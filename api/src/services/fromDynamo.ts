import { getItem, getAll } from './aws'
import { User } from '../models/users/user'
import { Student } from '../models/students/student'
import { Course } from '../models/courses/course'
import { Assignment } from '../models/assignments/assignment'
import { Attempt } from '../models/attempts/attempt'
import { USER_TABLE, STUDENT_TABLE, COURSE_TABLE, ASSIGNMENT_TABLE, ATTEMPT_TABLE } from './tables'
import { badRequestResponse } from './rest'

/**
 * Function gets a user from the database and turns it into a User model object
 * @param {String} suiteEmail Email of the user
 * @returns {User | null} User if it was found, null if not
 */
export const userFromDynamo = async (suiteEmail:string) => await fromDynamo(USER_TABLE, User, { suiteEmail }) as User | null

/**
 * Function gets all users from the database and turns them into User models
 * @returns {User[]} All users
 */
export const allUsersFromDynamo = async () => await allFromDynamo(USER_TABLE, User) as User[]

/**
 * Function gets all users with a certain role from the database and turns them into User models
 * @param {string} role - The role to filter users by
 * @returns {User[]} Users with the specified role
 */
export const getUsersByRoleFromDynamo = async (role:string) => {
    const users = await getAll(USER_TABLE)
    const filteredUsers = users.filter(user => user.role === role)
    return filteredUsers.map(user => new User(user))
}

/**
 * Function gets a course from the database and turns it into a Course model object
 * @param {id} id ID of the course
 * @returns {Course | null} Course if it was found, null if not
 */
export const courseFromDynamo = async (id:string) => await fromDynamo(COURSE_TABLE, Course, { id }) as Course | null

/**
 * Function gets all courses from the database and turns them into Course models
 * @returns {Course[]} All courses
 */
export const allCoursesFromDynamo = async () => await allFromDynamo(COURSE_TABLE, Course) as Course[]

/**
 * Function gets all courses from the database with student
 * @returns {Course[]} All Courses of type
 */
export const studentCoursesFromDynamo = async (suiteEmail:string) => {
    try {
        const courses = await getAll(COURSE_TABLE, { ModelClass: Course })
        return courses.map(course => new Course(course))
    } catch (err) {
        return null
    }
}

/**
 * Function gets an assignment from the database and turns it into a Assignment model object
 * @param {id} id ID of the assignment
 * @returns {Assignment | null} Assignment if it was found, null if not
 */
export const assignmentFromDynamo = async (id:string) => await fromDynamo(ASSIGNMENT_TABLE, Assignment, { id }) as Assignment | null

/**
 * Function gets all assignments from the database and turns them into Assignment models
 * @returns {Assignment[]} All assignments
 */
export const allAssignmentsFromDynamo = async () => await allFromDynamo(ASSIGNMENT_TABLE, Assignment) as Assignment[]

/**
 * Function gets an attempt from the database and turns it into a Attempt model object
 * @param {id} id ID of the attempt
 * @returns {Attempt | null} Attempt if it was found, null if not
 */
export const attemptFromDynamo = async (id:string) => await fromDynamo(ATTEMPT_TABLE, Attempt, { id }) as Attempt | null

/**
 * Function gets all attempts from the database and turns them into Attempt models
 * @returns {Attempts[]} All attempts
 */
export const allAttemptsFromDynamo = async () => await allFromDynamo(ATTEMPT_TABLE, Attempt) as Attempt[]

/**
 * Function gets all students from the database and turns them into Student models
 * @returns {Student[]} All students
 */
export const allStudentsFromDynamo = async () => await allFromDynamo(STUDENT_TABLE, Student) as Student[]
/**
 * Function gets all students in a certain course from the database
 * @returns {Student[]} All students
 */
export const allStudentsinCourseFromDynamo = async (courseID:string) => {
    const course = await courseFromDynamo(courseID)
    if (!course) return badRequestResponse('Course does not exist', 404)
    const students = course.students || []
    return students
}

/**
 * Function gets a student from the database and turns it into a Student model object
 * @param {String} suiteEmail Email of the student
 * @returns {Student | null} Student if it was found, null if not
 */
export const getSuiteStudentsFromDynamo = async (suiteEmail:string) => {
    try {
        const prom = await getItem(STUDENT_TABLE, { suiteEmail }, { ModelClass: Student })
        return prom.Item ? new Student(prom.Item) : null
    } catch (err) {
        return null
    }
}

// ############################## HELPER FUNCTIONS ############################

// export const userFromDynamo = async (suiteEmail: string) => (await fromDynamo(USER_TABLE, User, { suiteEmail })) as User | null
// export const allUsersFromDynamo = async () => (await allFromDynamo(USER_TABLE, User)) as User[]

/**
 * Gets an item from dynamo using passed in variables
 * @param {string} table The name of the table to get item from
 * @param {any} ModelClass The model class to turn the item into
 * @param {object} key Key of the item to get
 * @returns An item of class ModelClass or null
 */
async function fromDynamo (table: string, ModelClass: any, key: object) {
    try {
        const prom = await getItem(table, key, { ModelClass })
        return prom.Item ? new ModelClass(prom.Item) : null
    } catch (err) {
        return null
    }
}

/**
 * Gets all items from a dynamo table and turns them into an array of a passed in class
 * @param {string} table The name of the table to get items from
 * @param {any} ModelClass The model class to turn the items into
 * @returns An array of class ModelClass items
 */
async function allFromDynamo (table: string, ModelClass: any) {
    const items = await getAll(table, { ModelClass }) ?? []
    return items.map((item) => new ModelClass(item))
}
