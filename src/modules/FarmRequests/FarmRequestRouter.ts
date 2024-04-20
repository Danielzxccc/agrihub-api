import * as FarmRequestController from './FarmRequestController'
import express from 'express'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
import upload from '../../config/multer'

export const FarmRequestRouter = express.Router()

FarmRequestRouter.post(
  '/seedling',
  UserGuard(['farm_head']),
  FarmRequestController.createtSeedlingRequest
)

FarmRequestRouter.delete(
  '/seedling/cancel/:id',
  UserGuard(['farm_head']),
  FarmRequestController.cancelSeedlingRequest
)

FarmRequestRouter.get(
  '/seedling/list/all',
  UserGuard(['admin', 'asst_admin']),
  FarmRequestController.listAllSeedlingRequests
)

FarmRequestRouter.get(
  '/seedling/list/:id',
  UserGuard(['farm_head', 'farmer', 'admin', 'asst_admin']),
  FarmRequestController.listSeedlingRequestByFarm
)

FarmRequestRouter.put(
  '/seedling/accept/:id',
  UserGuard(['admin', 'asst_admin']),
  FarmRequestController.acceptSeedlingRequest
)

FarmRequestRouter.delete(
  '/seedling/reject/:id',
  UserGuard(['admin', 'asst_admin']),
  FarmRequestController.rejectSeedlingRequest
)

FarmRequestRouter.get(
  '/count',
  UserGuard(['admin', 'asst_admin']),
  FarmRequestController.listFarmRequestsCount
)

FarmRequestRouter.post(
  '/tool-request',
  UserGuard(['farm_head']),
  FarmRequestController.submitNewToolRequest
)

FarmRequestRouter.get(
  '/tool-request',
  UserGuard(['admin', 'asst_admin', 'farm_head']),
  FarmRequestController.listToolRequests
)

FarmRequestRouter.post(
  '/tool-request/update/:id',
  UserGuard(['admin', 'asst_admin']),
  FarmRequestController.updateToolRequestStatus
)

FarmRequestRouter.post(
  '/tool-request/cancel/:id',
  UserGuard(['farm_head']),
  FarmRequestController.cancelToolRequest
)
