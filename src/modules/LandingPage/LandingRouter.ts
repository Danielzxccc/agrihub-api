import * as LandingController from './LandingController'
import express from 'express'
import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'

export const LandingRouter = express.Router()

//get
LandingRouter.get('/image/:id', LandingController.listImages)
LandingRouter.get('/approach-details/:id', LandingController.listApproach)
LandingRouter.get(
  '/landing-details/:id',
  LandingController.listLandingPageDetails
)

//update content
LandingRouter.put(
  '/',
  UserGuard(['admin', 'asst_admin']),
  LandingController.updateLanding
)

//update content approach
LandingRouter.put(
  '/approach',
  UserGuard(['admin', 'asst_admin']),
  LandingController.updateApproach
)

//images
LandingRouter.post(
  '/landing_images',
  upload.single('images'),
  UserGuard(['admin', 'asst_admin']),
  LandingController.addImage
)

LandingRouter.delete('/landing_images/:id', LandingController.deleteImage)
