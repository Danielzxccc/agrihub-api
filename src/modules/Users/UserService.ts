import { db } from '../../config/database'
import { NewUser, User } from '../../types/DBTypes'

export async function findUserByUsername(username: string): Promise<User> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('username', '=', username)
    .executeTakeFirst()
}

export async function findUserByEmail(email: string): Promise<User> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst()
}

export async function createUser(user: NewUser) {
  return await db
    .insertInto('users')
    .values(user)
    .returningAll()
    .executeTakeFirst()
}
