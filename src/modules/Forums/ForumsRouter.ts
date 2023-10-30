import upload from '../../config/multer'
import * as ForumsController from './ForumsController'
import express from 'express'

export const ForumsRouter = express.Router()

ForumsRouter.post(
  '/',
  upload.array('imagesrc'),
  ForumsController.createNewQuestion
)
