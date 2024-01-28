import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
import * as ReportsController from './ReportsController'
import express from 'express'

export const ReportsRouter = express.Router()

ReportsRouter.post(
  '/crop',
  UserGuard(['farm_head']),
  upload.array('image'),
  ReportsController.createCommunityCropReport
)

ReportsRouter.get(
  '/farmer/graph/stacked-bar',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.listWitheredHarvestedCrops
)

ReportsRouter.get(
  '/farmer/total-harvested',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.listTotalHarvestedCrops
)

ReportsRouter.get(
  '/crop/statistics/:name',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.viewCropStatistics
)
