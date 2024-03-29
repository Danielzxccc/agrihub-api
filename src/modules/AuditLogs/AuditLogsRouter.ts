import express from 'express'
import * as AuditLogsController from './AuditLogsController'
import { UserGuard } from '../AuthGuard/UserGuard'

export const AuditLogsRouter = express.Router()

AuditLogsRouter.get(
  '/',
  UserGuard(['asst_admin', 'admin']),
  AuditLogsController.findAuditLogs
)
