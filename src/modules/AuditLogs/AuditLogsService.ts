import { db } from '../../config/database'
import { NewAuditLogs } from '../../types/DBTypes'

export async function createAuditLog(log: NewAuditLogs) {
  return await db
    .insertInto('audit_logs')
    .values(log)
    .returningAll()
    .executeTakeFirst()
}
