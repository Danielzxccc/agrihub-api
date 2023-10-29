import { sql } from 'kysely'
import { db } from '../../config/database'

export async function generateToken(userid: string) {
  return await db
    .insertInto('email_token')
    .values({
      userid,
      token: sql`uuid_generate_v4()`,
      expiresat: sql`NOW() + INTERVAL '1 hours 30 minutes'`,
    })
    .returningAll()
    .executeTakeFirst()
}

export async function findToken(token: string) {
  return await db
    .selectFrom('email_token')
    .selectAll()
    .where('token', '=', token)
    .where('expiresat', '>=', sql`CURRENT_TIMESTAMP`)
    .executeTakeFirst()
}

export async function deleteToken(id: string) {
  return await db.deleteFrom('email_token').where('id', '=', id).execute()
}
