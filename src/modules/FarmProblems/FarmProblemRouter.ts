import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
import express from 'express'
import * as FarmProblemController from './FarmProblemController'
// import upload from '../../config/multer'

export const FarmProblemRouter = express.Router()

FarmProblemRouter.post(
  '/',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmProblemController.upsertFarmProblem
)

FarmProblemRouter.get(
  '/list',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmProblemController.listFarmProblems
)

FarmProblemRouter.get(
  '/archived/list',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmProblemController.listArchivedFarmProblems
)

FarmProblemRouter.get(
  '/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmProblemController.viewFarmProblem
)

FarmProblemRouter.delete(
  '/archive/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmProblemController.archiveProblem
)

FarmProblemRouter.put(
  '/unarchive/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmProblemController.unarchiveProblem
)

FarmProblemRouter.delete(
  '/material/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmProblemController.deleteFarmProblemMaterial
)

FarmProblemRouter.post(
  '/report',
  UserGuard(['farm_head']),
  FarmProblemController.sendFarmProblemReport
)
