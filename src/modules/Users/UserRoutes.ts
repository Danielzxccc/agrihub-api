import * as UserController from './UserController'
import express from 'express'

export const UserRouter = express.Router()

UserRouter.get('/profile/:username', UserController.findUserProfile)
