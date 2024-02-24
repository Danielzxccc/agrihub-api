import * as FarmRequestController from './FarmRequestController'
import express from 'express'
import { UserGuard } from '../AuthGuard/UserGuard'
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
  '/seedling/list',
  UserGuard(['farm_head']),
  FarmRequestController.listSeedlingRequestByFarm
)

FarmRequestRouter.get(
  '/seedling/list/all',
  UserGuard(['admin', 'asst_admin']),
  FarmRequestController.listAllSeedlingRequests
)

FarmRequestRouter.put(
  '/seedling/accept/:id',
  UserGuard(['farm_head']),
  FarmRequestController.acceptSeedlingRequest
)

FarmRequestRouter.delete(
  '/seedling/reject/:id',
  UserGuard(['farm_head']),
  FarmRequestController.rejectSeedlingRequest
)
