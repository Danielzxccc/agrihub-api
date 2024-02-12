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
  perpage: number
) {
  let query = db.selectFrom('audit_logs').selectAll()

  //  if (searchKey.length) {
  //    query = query.where((eb) =>
  //      eb.or([
  //        eb('action', 'ilike', `${searchKey}%`),
  //        eb('title', 'ilike', `${searchKey}%`),
  //      ])
  //    )
  //  }

  return await query.limit(perpage).offset(offset).execute()
}
