import { db } from '../../config/database'
import { NewAuditLogs } from '../../types/DBTypes'

export async function createAuditLog(log: NewAuditLogs) {
  return await db
    .insertInto('audit_logs')
    .values(log)
    .returningAll()
    .executeTakeFirst()
}

export async function findAuditLogs(
  offset: number,
  searchKey: string,
  perpage: number,
  user?: string
) {
  let query = db
    .selectFrom('audit_logs as al')
    .leftJoin('users as u', 'u.id', 'al.userid')
    .select([
      'al.id',
      'al.action',
      'al.createdat',
      'al.userid',
      'al.section',
      'u.avatar',
      'u.firstname',
      'u.lastname',
      'u.username',
      'u.role',
      'u.email',
    ])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('al.action', 'ilike', `${searchKey}%`),
        eb('al.section', 'ilike', `${searchKey}%`),
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.username', 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (user) {
    query = query.where('userid', '=', user)
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalAuditLogs(searchKey: string, user?: string) {
  let query = db
    .selectFrom('audit_logs as al')
    .leftJoin('users as u', 'u.id', 'al.userid')
    .select(({ fn }) => [fn.count<number>('al.id').as('count')])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('al.action', 'ilike', `${searchKey}%`),
        eb('al.section', 'ilike', `${searchKey}%`),
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.username', 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (user) {
    query = query.where('userid', '=', user)
  }

  return await query.executeTakeFirst()
}
