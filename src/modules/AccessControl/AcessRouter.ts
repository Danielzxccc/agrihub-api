import * as AccesController from './AcessController'
import express from 'express'
import { UserGuard } from '../AuthGuard/UserGuard'
import upload from '../../config/multer'

export const AccessRouter = express.Router()

AccessRouter.post(
  '/create/admin',
  UserGuard(['admin']),
  AccesController.createNewAdmin
)
