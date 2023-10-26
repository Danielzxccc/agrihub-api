import * as ForumsController from './ForumsController'
import express from 'express'

export const ForumsRouter = express.Router()

ForumsRouter.post('/', ForumsController.createNewQuestion)
