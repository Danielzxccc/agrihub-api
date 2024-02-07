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

LearningRouter.post(
  '/create/resource/:id',
  UserGuard(['admin', 'asst_admin']),
  upload.single('image'),
  LearningController.createLearningResource
)

LearningRouter.delete(
  '/remove/resource/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.removeLearningResource
)

LearningRouter.post(
  '/create/credits/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.createLearningCredits
)

LearningRouter.delete(
  '/remove/credits/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.removeLearningCredits
)

LearningRouter.post(
  '/create/tags/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.createLearningTags
)

LearningRouter.delete(
  '/remove/tags/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.removeLearningTags
)
