import * as CmsController from './CmsController'
import express from 'express'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
import upload from '../../config/multer'

export const CmsRouter = express.Router()

CmsRouter.get('/client-details', CmsController.findClientDetails)

CmsRouter.put(
  '/client-details',
  AccessGuard('cuai'),
  UserGuard(['admin', 'asst_admin']),
  CmsController.updateClientDetails
)

CmsRouter.delete(
  '/client-details/social/:id',
  AccessGuard('cuai'),
  UserGuard(['admin', 'asst_admin']),
  CmsController.deleteClientSocial
)

CmsRouter.delete(
  '/client-details/partner/:id',
  AccessGuard('cuai'),
  UserGuard(['admin', 'asst_admin']),
  CmsController.deleteClientPartner
)

CmsRouter.delete(
  '/client-details/member/:id',
  AccessGuard('cuai'),
  UserGuard(['admin', 'asst_admin']),
  CmsController.deleteClientMember
)

CmsRouter.post(
  '/user-feedback',
  UserGuard(['farm_head', 'farmer', 'member', 'user']),
  CmsController.createUserFeedback
)

CmsRouter.get(
  '/user-feedbacks/:id',
  AccessGuard('user_feedback'),
  UserGuard(['asst_admin', 'admin']),
  CmsController.viewUserFeedback
)

CmsRouter.get(
  '/user-feedbacks',
  AccessGuard('user_feedback'),
  UserGuard(['asst_admin', 'admin']),
  CmsController.listUserFeedbacks
)

CmsRouter.get('/vision-stats', CmsController.getVisionStatistics)
CmsRouter.get('/about', CmsController.viewAboutUs)

CmsRouter.post(
  '/about/add-carousel',
  AccessGuard('about'),
  UserGuard(['asst_admin', 'admin']),
  upload.single('image'),
  CmsController.createAboutCarouselImage
)

CmsRouter.delete(
  '/about/delete-carousel/:id',
  AccessGuard('about'),
  UserGuard(['asst_admin', 'admin']),
  CmsController.deleteAboutCarouselImage
)

CmsRouter.put(
  '/about/update',
  AccessGuard('about'),
  UserGuard(['asst_admin', 'admin']),
  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'city_image', maxCount: 1 },
    { name: 'president_image', maxCount: 1 },
    { name: 'qcu_logo', maxCount: 1 },
    { name: 'agrihub_user_logo', maxCount: 1 },
  ]),
  CmsController.updateAboutUs
)
