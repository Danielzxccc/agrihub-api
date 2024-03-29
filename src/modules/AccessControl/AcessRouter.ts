import * as AccesController from './AcessController'
import express from 'express'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
import upload from '../../config/multer'

export const AccessRouter = express.Router()

AccessRouter.post(
  '/create/admin',
  AccessGuard('admin'),
  UserGuard(['admin']),
  AccesController.createNewAdmin
)

AccessRouter.put(
  '/update/access/:id',
  AccessGuard('admin'),
  UserGuard(['admin', 'asst_admin']),
  AccesController.updateAdminAccess
)

AccessRouter.get(
  '/view/access/:id',
  AccessGuard('admin'),
  UserGuard(['admin', 'asst_admin']),
  AccesController.viewAdminAccess
)
