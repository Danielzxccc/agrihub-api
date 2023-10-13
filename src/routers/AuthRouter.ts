import * as AuthController from '../controllers/AuthController'
import express from 'express'

export const AuthRouter = express.Router()

AuthRouter.post('/login', AuthController.authenticateUser)
AuthRouter.post('/register', AuthController.registerUser)
