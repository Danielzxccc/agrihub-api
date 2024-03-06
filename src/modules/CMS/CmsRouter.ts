import * as CmsController from './CmsController'
import express from 'express'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
import upload from '../../config/multer'

export const CmsRouter = express.Router()

CmsRouter.get('/client-details', CmsController.findClientDetails)
