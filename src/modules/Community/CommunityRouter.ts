import { UserGuard } from '../AuthGuard/UserGuard'
import * as CommunityController from './CommunityController'
import express from 'express'

export const CommunityRouter = express.Router()

CommunityRouter.post(
  '/questions',
  UserGuard(['farm_head']),
  CommunityController.createNewFarmQuestion
)

CommunityRouter.get('/questions/:id', CommunityController.findFarmQuestions)
CommunityRouter.delete('/questions/:id', CommunityController.deleteFarmQuestion)
