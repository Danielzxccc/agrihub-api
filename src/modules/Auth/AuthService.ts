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

export async function findResetTokenByUserId(id: string) {
  return await db
    .selectFrom('reset_token')
    .selectAll()
    .where('userid', '=', id)
    .where('expiresat', '>=', sql`CURRENT_TIMESTAMP`)
    .executeTakeFirst()
}

export async function deleteResetToken(id: string) {
  return await db.deleteFrom('reset_token').where('id', '=', id).execute()
}

export async function generateOTPcode(
  userid: string,
  code: number,
  phone_number: string
) {
  const generatedTimestamp = moment()
    .add(5, 'minutes')
    .format('YYYY-MM-DD HH:mm:ss.SSSSSS')
  return await db
    .insertInto('otp')
    .values({
      userid,
      otp_code: code,
      expiresat: generatedTimestamp,
      phone_number,
    })
    .returningAll()
    .executeTakeFirst()
}

export async function findOTPCode(userid: string, code: number) {
  return await db
    .selectFrom('otp')
    .selectAll()
    .where('userid', '=', userid)
    .where('otp_code', '=', String(code))
    .where('expiresat', '>=', sql`CURRENT_TIMESTAMP`)
    .executeTakeFirst()
}

export async function findOTPResetCode(code: number) {
  return await db
    .selectFrom('otp')
    .selectAll()
    .where('otp_code', '=', String(code))
    .where('expiresat', '>=', sql`CURRENT_TIMESTAMP`)
    .executeTakeFirst()
}

export async function deleteOTPCode(id: string, code: string, number: string) {
  return await db
    .deleteFrom('otp')
    .returningAll()
    .where((eb) =>
      eb.or([
        eb('userid', '=', id),
        eb('otp_code', '=', code),
        eb('phone_number', '=', number),
      ])
    )
    .execute()
}

export async function removeUnverifiedPhoneNumber(phone: string) {
  return await db
    .deleteFrom('users')
    .where('contact_number', '=', phone)
    .where('verification_level', '>', '1')
    .execute()
}
