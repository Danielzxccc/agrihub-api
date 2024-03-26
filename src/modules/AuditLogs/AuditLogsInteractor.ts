// import

import { NewAuditLogs } from '../../types/DBTypes'
import log from '../../utils/utils'
import { findUser } from '../Users/UserService'
import * as Service from './AuditLogsService'

// export async function listAuditLog(
//   offset: number,
//   searchKey: string,
//   perpage: number
// ) {

// }

export async function createAuditLog(auditLog: NewAuditLogs) {
  try {
    await Service.createAuditLog(auditLog)
  } catch (error) {
    log.warn('Failed to create audit log')
  }
}

export async function findAuditLogs(
  offset: number,
  searchKey: string,
  perpage: number,
  userid: string
) {
  const user = await findUser(userid)

  const auditLogAccess = user.role === 'admin' ? undefined : user.id

  const [data, total] = await Promise.all([
    Service.findAuditLogs(offset, searchKey, perpage, auditLogAccess),
    Service.getTotalAuditLogs(searchKey, auditLogAccess),
  ])

  return { data, total }
}
