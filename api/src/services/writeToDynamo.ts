import { addOrUpdateItem, deleteItem } from './aws'
import { USER_TABLE, ASSIGNMENT_TABLE, ATTEMPT_TABLE, COURSE_TABLE, STUDENT_TABLE } from './tables'
import { User } from '../models/users/user'
import { Assignment } from '../models/assignments/assignment'
import { Attempt } from '../models/attempts/attempt'
import { Course } from '../models/courses/course'
import { Student } from '../models/students/student'

export const addOrUpdateUser = (user: User) => {
    if (!(user instanceof User)) throw Error('addOrUpdateUser - user must be a User Object')
    return addOrUpdateItem(USER_TABLE, user, { ModelClass: User })
}

export const addOrUpdateAssignment = (assignment: Assignment) => {
    if (!(assignment instanceof Assignment)) throw Error('addOrUpdateAssignment - assignment must be a Assignment Object')
    return addOrUpdateItem(ASSIGNMENT_TABLE, assignment, { ModelClass: Assignment })
}

export const addOrUpdateAttempt = (attempt: Attempt) => {
    if (!(attempt instanceof Attempt)) throw Error('addOrUpdateAttempt - attempt must be a Attempt Object')
    return addOrUpdateItem(ATTEMPT_TABLE, attempt, { ModelClass: Attempt })
}

export const addOrUpdateCourse = (course: Course) => {
    if (!(course instanceof Course)) throw Error('addOrUpdateCourse - course must be a Course Object')
    return addOrUpdateItem(COURSE_TABLE, course, { ModelClass: Course })
}

export const addOrUpdateStudent = (student: Student) => {
    if (!(student instanceof Student)) throw Error('addOrUpdateStudent - student must be a Student Object')
    return addOrUpdateItem(STUDENT_TABLE, student, { ModelClass: Student })
}

export const deleteUser = (suiteEmail: string) => deleteItem(USER_TABLE, { suiteEmail }, { ModelClass: User })
export const deleteAssignment = (id: string) => deleteItem(ASSIGNMENT_TABLE, { id }, { ModelClass: Assignment })
export const deleteAttempt = (id: string) => deleteItem(ATTEMPT_TABLE, { id }, { ModelClass: Attempt })
export const deleteCourse = (id: string) => deleteItem(COURSE_TABLE, { id }, { ModelClass: Course })
export const deleteStudent = (suiteEmail: string) => deleteItem(STUDENT_TABLE, { suiteEmail }, { ModelClass: Student })
