import upload from '../../config/multer'
import { rateLimiter } from '../../middleware/RateLimitter'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
import * as ForumsController from './ForumsController'
import express from 'express'

export const ForumsRouter = express.Router()

ForumsRouter.get('/', ForumsController.listQuestions)
ForumsRouter.get('/:id', ForumsController.viewQuestion)

ForumsRouter.post(
  '/vote/:id',
  UserGuard([
    'member',
    'farmer',
    'farm_head',
    'subfarm_head',
    'admin',
    'asst_admin',
  ]),
  ForumsController.voteQuestion
)

ForumsRouter.delete(
  '/vote/delete/:id',
  UserGuard([
    'member',
    'farmer',
    'farm_head',
    'subfarm_head',
    'admin',
    'asst_admin',
  ]),
  ForumsController.deleteVoteQuestion
)

ForumsRouter.post(
  '/',
  UserGuard([
    'member',
    'farmer',
    'farm_head',
    'subfarm_head',
    'admin',
    'asst_admin',
  ]),
  upload.array('imagesrc'),
  ForumsController.createNewQuestion
)
ForumsRouter.put(
  '/:id',
  UserGuard([
    'member',
    'farmer',
    'farm_head',
    'subfarm_head',
    'admin',
    'asst_admin',
  ]),
  upload.array('imagesrc'),
  ForumsController.updateQuestion
)

ForumsRouter.post(
  '/create/answers/:id',
  UserGuard([
    'member',
    'farmer',
    'farm_head',
    'subfarm_head',
    'admin',
    'asst_admin',
  ]),
  ForumsController.createNewAnswer
)

ForumsRouter.post(
  '/create/comments/:answerId',
  UserGuard([
    'member',
    'farmer',
    'farm_head',
    'subfarm_head',
    'admin',
    'asst_admin',
  ]),
  ForumsController.createNewComment
)

ForumsRouter.post(
  '/vote/answer/:id',
  UserGuard([
    'member',
    'farmer',
    'farm_head',
    'subfarm_head',
    'admin',
    'asst_admin',
  ]),
  ForumsController.voteAnswer
)

ForumsRouter.delete(
  '/delete/vote-answer/:id',
  ForumsController.deleteVoteAnswer
)

ForumsRouter.post('/save/question/:id', ForumsController.saveQuestion)

ForumsRouter.post('/report/question/:id', ForumsController.reportQuestion)

ForumsRouter.delete(
  '/remove/saved/question/:id',
  ForumsController.removeSavedQuestion
)

ForumsRouter.delete('/delete/question/:id', ForumsController.deleteQuestion)

ForumsRouter.delete('/delete/answer/:id', ForumsController.deleteAnswer)

ForumsRouter.delete('/delete/comment/:id', ForumsController.deleteComment)

ForumsRouter.get('/saved/questions', ForumsController.listSavedQuestions)

ForumsRouter.get(
  '/reported/questions',
  AccessGuard('forums'),
  UserGuard(['asst_admin', 'admin']),
  ForumsController.listReportedQuestions
)

ForumsRouter.put('/update/answer/:id', ForumsController.updateAnswer)

ForumsRouter.put('/update/comment/:id', ForumsController.updateComment)
