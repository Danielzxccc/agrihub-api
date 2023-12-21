import * as AboutController from './AboutController'
import express from 'express'
import { UserGuard } from '../AuthGuard/UserGuard'

export const AboutRouter = express.Router()

AboutRouter.put('/', AboutController.updateAbout)
