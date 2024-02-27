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

export async function generateResetToken(userid: string) {
  const generatedTimestamp = moment()
    .add(5, 'minutes')
    .format('YYYY-MM-DD HH:mm:ss.SSSSSS')

  return await db
    .insertInto('reset_token')
    .values({
      userid,
      expiresat: generatedTimestamp,
    })
    .returningAll()
    .executeTakeFirst()
}

export async function findResetToken(token: string) {
  return await db
    .selectFrom('reset_token')
    .selectAll()
    .where('id', '=', token)
    .where('expiresat', '>=', sql`CURRENT_TIMESTAMP`)
    .executeTakeFirst()
}

export async function deleteResetToken(id: string) {
  return await db.deleteFrom('reset_token').where('id', '=', id).execute()
}
