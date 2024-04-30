import express from 'express'
import * as AnalyticsController from './AnalyticsController'
import { UserGuard } from '../AuthGuard/UserGuard'

export const AnalyticsRouter = express.Router()

AnalyticsRouter.get(
  '/latest/harvest-rate/:id',
  UserGuard(['asst_admin', 'admin', 'farm_head', 'farmer']),
  AnalyticsController.getLatestHarvestRate
)
