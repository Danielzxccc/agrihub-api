import { sql } from 'kysely'
import { db } from '../../config/database'
import { NewUser, UpdateUser, User } from '../../types/DBTypes'

export async function findUser(id: string) {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

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

export async function findByEmailOrUsername(user: string): Promise<User> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where((eb) => eb.or([eb('username', '=', user), eb('email', '=', user)]))
    .executeTakeFirst()
}

export async function updateUser(id: string, user: UpdateUser) {
  return await db
    .updateTable('users')
    .set({ ...user, updatedat: sql`CURRENT_TIMESTAMP` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function createUser(user: NewUser) {
  return await db
    .insertInto('users')
    .values(user)
    .returning(['id', 'email'])
    .executeTakeFirst()
}
