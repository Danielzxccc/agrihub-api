import * as AuthController from './AuthController'
import express from 'express'

export const AccountRouter = express.Router()

AccountRouter.post('/signup', AuthController.registerUser)
AccountRouter.post('/send-verification', AuthController.sendEmailVerification)
AccountRouter.get('/verify-email/:id', AuthController.verifyAccountLevelOne)
AccountRouter.post('/profile-completion', AuthController.verifyAccountLevelTwo)
