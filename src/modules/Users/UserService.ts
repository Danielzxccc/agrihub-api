import { sql } from 'kysely'
import { db } from '../../config/database'
import { NewUser, UpdateUser, User } from '../../types/DBTypes'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'

export async function listUsers(
  offset: number,
  perpage: number,
  filterKey?: string,
  searchKey?: string
) {
  let query = db
    .selectFrom('users as u')
    .leftJoin('farm_members as fm', 'u.id', 'fm.userid')
    .leftJoin('sub_farms as sf', 'fm.farmid', 'sf.id')
    .leftJoin('farms as f', 'sf.farmid', 'f.id')
    .select(({ fn, val }) => [
      'u.id',
      'u.createdat',
      fn<string>('concat', ['u.firstname', val(' '), 'u.lastname']).as(
        'fullname'
      ),
      'u.email',
      'f.name',
      'u.verification_level',
    ])
    .groupBy(['u.id', 'f.name', 'u.username'])
    .orderBy('u.id')

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
    .limit(perpage)
    .offset(offset)
    .execute()
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

export async function getTotalUsers() {
  return await db
    .selectFrom('users')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirst()
}

export async function findUser(id: string) {
  return await db
    .selectFrom('admin_access')
    .rightJoin('users', 'users.id', 'admin_access.userid')
    .selectAll()
    .where('users.id', '=', id)
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
