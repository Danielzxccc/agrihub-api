import { sql } from 'kysely'
import { db } from '../../config/database'
import moment from 'moment'

export async function generateToken(userid: string) {
  const generatedTimestamp = moment()
    .add(30, 'minutes')
    .format('YYYY-MM-DD HH:mm:ss.SSSSSS')

  return await db
    .insertInto('email_token')
    .values({
      userid,
      token: sql`gen_random_uuid()`,
      expiresat: generatedTimestamp,
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
