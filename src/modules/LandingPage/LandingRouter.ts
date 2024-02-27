import * as LandingController from './LandingController'
import express from 'express'
import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'

export const LandingRouter = express.Router()

// //get

// LandingRouter.get('/approach-details/:id', LandingController.listApproach)
LandingRouter.get('/details', LandingController.listLandingPageDetails)

LandingRouter.put(
  '/update',
  UserGuard(['admin', 'asst_admin']),
  LandingController.updateLanding
)

LandingRouter.post(
  '/create/image',
  UserGuard(['admin', 'asst_admin']),
  upload.single('image'),
  LandingController.addImage
)

// LandingRouter.get('/images', LandingController.listImages)

LandingRouter.delete('/delete/image/:id', LandingController.deleteImage)

LandingRouter.delete('/delete/approach/:id', LandingController.removeApproach)

// //update content

// //update content approach
LandingRouter.post(
  '/update/approach',
  UserGuard(['admin', 'asst_admin']),
  LandingController.updateApproach
)

// //images
