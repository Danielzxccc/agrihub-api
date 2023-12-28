import * as AboutController from './AboutController'
import express from 'express'
import { UserGuard } from '../AuthGuard/UserGuard'
import upload from '../../config/multer'

export const AboutRouter = express.Router()

AboutRouter.put('/', AboutController.updateAbout)
AboutRouter.post(
  '/about_gallery',
  upload.single('imagesrc'),
  AboutController.addImage
)
AboutRouter.delete('/about_gallery/:id', AboutController.deleteImage)
