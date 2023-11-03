import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
import * as ForumsController from './ForumsController'
import express from 'express'

export const ForumsRouter = express.Router()

ForumsRouter.post(
  '/',
  upload.array('imagesrc'),
  ForumsController.createNewQuestion
)

ForumsRouter.post('/create/answers/:id', ForumsController.createNewAnswer)

ForumsRouter.post(
  '/create/comments/:answerId',
  UserGuard(['user']),
  ForumsController.createNewComment
)
