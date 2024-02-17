import express from 'express'
import * as LearningController from './LearningController'
import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'

export const LearningRouter = express.Router()

LearningRouter.get(
  '/view/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.viewLearningMaterial
)

LearningRouter.get(
  '/view/published/:id',
  LearningController.viewLearningMaterial
)

LearningRouter.get('/related', LearningController.listRelatedLearningMaterials)

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

LearningRouter.put(
  '/update/resource/:id',
  UserGuard(['admin', 'asst_admin']),
  upload.single('image'),
  LearningController.updateLearningResource
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

LearningRouter.put(
  '/update/credits/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.updateLearningCredits
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

LearningRouter.get(
  '/draft',
  UserGuard(['admin', 'asst_admin']),
  LearningController.listDraftLearningMaterials
)

LearningRouter.get(
  '/published',
  LearningController.listPublishedLearningMaterials
)

LearningRouter.put(
  '/publish/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.publishLearningMaterial
)

LearningRouter.put(
  '/featured/:materialId/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.setFeaturedLearningResource
)

LearningRouter.delete(
  '/unpublish/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.unpublishLearningMaterial
)

LearningRouter.delete(
  '/draft/delete/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.removeLearningMaterial
)

LearningRouter.delete(
  '/archive/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.archiveLearningMaterial
)

LearningRouter.put(
  '/unarchive/:id',
  UserGuard(['admin', 'asst_admin']),
  LearningController.unArchiveLearningMaterial
)

LearningRouter.get(
  '/archive/list',
  UserGuard(['admin', 'asst_admin']),
  LearningController.listArchivedLearningMaterials
)
