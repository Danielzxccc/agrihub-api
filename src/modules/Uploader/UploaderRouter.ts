import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
import * as UploaderController from './UploaderController'
import express from 'express'

export const UploaderRouter = express.Router()

UploaderRouter.post(
  '/',
  UserGuard(['admin', 'asst_admin']),
  upload.single('image'),
  UploaderController.uploadAttachment
)

UploaderRouter.delete(
  '/:file',
  UserGuard(['admin', 'asst_admin']),
  UploaderController.deleteUploadedFile
)
