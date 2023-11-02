import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
import * as UserController from './UserController'
import express from 'express'

export const UserRouter = express.Router()

UserRouter.get('/profile/:username', UserController.findUserProfile)
UserRouter.put(
  '/profile/:id',
  UserGuard(['user']),
  upload.single('avatar'),
  UserController.updateUserProfile
)
