import { db } from '../config/database'
import { User } from '../types/DBTypes'

export async function findUserByUsername(username: string): Promise<User> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('username', '=', username)
    .executeTakeFirst()
}
