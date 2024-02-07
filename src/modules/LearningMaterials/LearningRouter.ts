import express from 'express'
import * as LearningController from './LearningController'
import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'

export const LearningRouter = express.Router()

LearningRouter.post(
  '/create/draft',
  UserGuard(['admin', 'asst_admin']),
  LearningController.createDraftLearningMaterial
)

LearningRouter.put(
  '/update/draft/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.updateDraftLearningMaterial
)
