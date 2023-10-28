import * as AuthController from './AuthController'
import express from 'express'

export const AuthRouter = express.Router()

AuthRouter.post('/login', AuthController.authenticateUser)
AuthRouter.get('/me', AuthController.getCurrentUser)
