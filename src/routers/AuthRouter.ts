import { authenticateUser } from '../controllers/AuthController'
import express from 'express'

export const AuthRouter = express.Router()

AuthRouter.post('/login', authenticateUser)
