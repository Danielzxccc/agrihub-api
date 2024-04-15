import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  NewReportedUser,
  NewUser,
  UpdateReportedUser,
  UpdateUser,
  User,
} from '../../types/DBTypes'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'
import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { findCommunityFarmById } from '../Farm/FarmService'
import { query } from 'express'

export async function listUsers(
  offset: number,
  perpage: number,
  filterKey?: string,
  searchKey?: string
) {
  let query = db.selectFrom('users as u').selectAll()

  if (searchKey.length >= 1) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query
    .where('u.isbanned', '=', false)
    .where('u.verification_level', '=', '4')
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalUsers(searchKey: string) {
  let query = db
    .selectFrom('users as u')
    .select(({ fn }) => [fn.count<number>('u.id').as('count')])
    .where('isbanned', '=', false)
    .where('verification_level', '=', '4')

  if (searchKey.length >= 1) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.executeTakeFirst()
}

export async function findMembers(
  offset: number,
  perpage: number,
  searchKey: string,
  farmid: string
) {
  let query = db
    .selectFrom('users as u')
    .select(({ fn, val }) => [
      'u.id',
      fn<string>('concat', [val(returnObjectUrl()), 'u.avatar']).as('avatar'),
      'u.firstname',
      'u.lastname',
      'u.username',
      'u.email',
    ])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
        eb('u.username', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query
    .where('u.isbanned', '=', false)
    .where('u.role', '=', 'member')
    .where('u.verification_level', '=', '4')
    .where(
      'u.id',
      'not in',
      sql`(SELECT u.id
      FROM users u
      LEFT JOIN farmer_invitations fi ON u.id = fi.userid
      WHERE fi.farmid = ${farmid})`
    )
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalMembers(farmid: string) {
  return await db
    .selectFrom('users as u')
    .select(({ fn }) => [fn.count<number>('u.id').as('count')])
    .where('u.isbanned', '=', false)
    .where('u.role', '=', 'member')
    .where('u.verification_level', '=', '4')
    .where(
      'u.id',
      'not in',
      sql`(SELECT u.id
      FROM users u
      LEFT JOIN farmer_invitations fi ON u.id = fi.userid
      WHERE fi.farmid = ${farmid})`
    )
    .executeTakeFirst()
}

export async function findUser(id: string) {
  const user = await db
    .selectFrom('admin_access')
    .rightJoin('users', 'users.id', 'admin_access.userid')
    .selectAll()
    .where('users.id', '=', id)
    .executeTakeFirst()

  if (user?.role === 'farm_head' || user?.role === 'farmer') {
    const community = await findCommunityFarmById(user.farm_id)

    const newObj = user as typeof user & { isFarmBanned: boolean }
    if (community.is_archived) {
      newObj.isFarmBanned = true
    }
    return newObj
  }

  return { ...user, activity_logs: true }
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

export async function findUserByNumber(number: string): Promise<User> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('contact_number', '=', number)
    .executeTakeFirst()
}

export async function findByEmailOrUsername(user: string): Promise<User> {
  return await db
    .selectFrom('users')
    .selectAll()
    .where((eb) =>
      eb.or([
        eb('username', '=', user),
        eb('email', '=', user),
        eb('contact_number', '=', user),
      ])
    )
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

export async function findAdmins(
  offset: number,
  perpage: number,
  searchKey?: string,
  filterKey?: 'banned' | 'active'
) {
  let query = db
    .selectFrom('users as u')
    .selectAll()
    .where('u.role', '=', 'asst_admin')

  if (searchKey.length >= 1) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
        eb('u.username', 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (filterKey === 'active') {
    query = query.where('u.isbanned', '=', false)
  }

  if (filterKey === 'banned') {
    query = query.where('u.isbanned', '=', true)
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalAdmins(filterKey: 'banned' | 'active') {
  let query = db
    .selectFrom('users as u')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('u.role', '=', 'asst_admin')

  if (filterKey === 'active') {
    query = query.where('u.isbanned', '=', false)
  }

  if (filterKey === 'banned') {
    query = query.where('u.isbanned', '=', true)
  }

  return await query.executeTakeFirst()
}

export async function clearUserSession(id: string) {
  return await db.executeQuery(
    sql`DELETE FROM session WHERE sess->>'userid' = ${id};`.compile(db)
  )
}

export async function findAdmin(id: string) {
  return await db
    .selectFrom('admin_access')
    .rightJoin('users', 'users.id', 'admin_access.userid')
    .selectAll()
    .where('users.id', '=', id)
    .where('users.role', '=', 'asst_admin')
    .executeTakeFirst()
}

export async function createReportedUser(report: NewReportedUser) {
  return await db
    .insertInto('reported_users')
    .values(report)
    .returningAll()
    .executeTakeFirst()
}

export async function findReportedUsers(
  offset: number,
  perpage: number,
  searchKey?: string,
  filterKey?: 'pending' | 'warned'
) {
  let query = db
    .selectFrom('reported_users as ru')
    .leftJoin('users as u', 'u.id', 'ru.reported')
    .select(({ eb }) => [
      'ru.id',
      'ru.reason',
      'ru.evidence',
      'ru.notes',
      'ru.status',
      'ru.createdat',
      'ru.status',
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select([
            sql<string>`CAST(id AS TEXT)`.as('id'),
            'firstname',
            'lastname',
            'email',
            'username',
          ])
          .whereRef('users.id', '=', 'ru.reported')
      ).as('reported'),
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select([
            sql<string>`CAST(id AS TEXT)`.as('id'),
            'firstname',
            'lastname',
            'email',
            'username',
          ])
          .whereRef('users.id', '=', 'ru.reported_by')
      ).as('reported_by'),
    ])
    .where('u.isbanned', '=', false)

  if (searchKey.length >= 1) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
        eb('u.username', 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (filterKey.length > 1) {
    query = query.where('ru.status', '=', filterKey)
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalReportedUsers(searchKey: string) {
  let query = db
    .selectFrom('reported_users as ru')
    .leftJoin('users as u', 'u.id', 'ru.reported')
    .select(({ fn }) => [fn.count<number>('ru.id').as('count')])

  if (searchKey.length >= 1) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
        eb('u.username', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.executeTakeFirst()
}

export async function findBannedUsers(
  offset: number,
  perpage: number,
  searchKey?: string
) {
  let query = db.selectFrom('users as u').selectAll()

  if (searchKey.length >= 1) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
        eb('u.username', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query
    .where('u.isbanned', '=', true)
    .where((eb) =>
      eb.or([
        eb('u.role', '=', 'member'),
        eb('u.role', '=', 'farm_head'),
        eb('u.role', '=', 'farmer'),
      ])
    )
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalBannedUsers(searchKey: string) {
  let query = db
    .selectFrom('users as u')
    .select(({ fn }) => [fn.count<number>('u.id').as('count')])
    .where('u.isbanned', '=', true)
    .where((eb) =>
      eb.or([
        eb('u.role', '=', 'member'),
        eb('u.role', '=', 'farm_head'),
        eb('u.role', '=', 'farmer'),
      ])
    )

  if (searchKey.length >= 1) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
        eb('u.username', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.executeTakeFirst()
}

export async function findReportedUser(id: string) {
  return await db
    .selectFrom('reported_users')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function updateReportedUser(
  id: string,
  report: UpdateReportedUser
) {
  return await db
    .updateTable('reported_users')
    .set(report)
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findAllAdmins() {
  return await db
    .selectFrom('users')
    .selectAll()
    .where((eb) =>
      eb.or([
        eb('users.role', '=', 'admin'),
        eb('users.role', '=', 'asst_admin'),
      ])
    )
    .execute()
}

export async function findUserByPhoneNumber(number: string) {
  return await db
    .selectFrom('users')
    .selectAll()
    .where('contact_number', '=', number)
    .executeTakeFirst()
}
