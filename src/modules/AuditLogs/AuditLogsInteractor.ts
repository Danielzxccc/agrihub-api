// import

import { NewAuditLogs } from '../../types/DBTypes'
import log from '../../utils/utils'
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
