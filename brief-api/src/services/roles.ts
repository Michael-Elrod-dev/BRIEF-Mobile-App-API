import { User } from '../models/users/user'

const ROLES: { [x:string]: number } = {
    Student: 1, // Roles that users are allowed to create themselves
    Instructor: 100,
    Admin: 1000, // Role that only super admins are allowed to create
    Super: 1001
}

/**
 * Function determines whether a user has privileges for a given role
 * @param {User} user The user
 * @param {Boolean} strict If the user's role should match exactly
 * @returns If this user has privileges for the given role
 */
function hasPrivileges (user: User, strict: boolean, role: number) {
    if (strict) return ROLES[user.role] === role
    return ROLES[user.role] >= role
}

export const studentPrivileges = (user: User, strict = false) => hasPrivileges(user, strict, ROLES.Student)
export const instructorPrivileges = (user: User, strict = false) => hasPrivileges(user, strict, ROLES.Instructor)
export const adminPrivileges = (user: User, strict = false) => hasPrivileges(user, strict, ROLES.Admin)
export const superPrivileges = (user: User, strict = false) => hasPrivileges(user, strict, ROLES.Super)

export const REGULAR_ROLES: any = {
    Student: 1,
    Instructor: 1,
    Super: 1
}
export const ADMIN_ROLES: any = {
    Admin: 1
}

export const roles = ROLES
