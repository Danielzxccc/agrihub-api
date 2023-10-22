import * as ForumsController from '../controllers/ForumsController'
import express from 'express'

export const ForumsRouter = express.Router()

ForumsRouter.post('/', ForumsController.createNewQuestion)
