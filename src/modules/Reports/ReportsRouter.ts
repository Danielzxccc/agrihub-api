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