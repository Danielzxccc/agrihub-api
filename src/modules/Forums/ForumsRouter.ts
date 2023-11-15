import upload from '../../config/multer'
import { rateLimiter } from '../../middleware/RateLimitter'
import { UserGuard } from '../AuthGuard/UserGuard'
import * as ForumsController from './ForumsController'
import express from 'express'

export const ForumsRouter = express.Router()

/**
 * @openapi
 * /api/forums:
 *   get:
 *     tags:
 *       - Forums
 *     summary: Get Questions Data
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for forums (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page (optional, default 10)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *            - newest
 *            - active
 *            - trending
 *         description: Filter criteria (optional, default newest)
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuestionsResponse"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 *
 *   post:
 *     tags:
 *       - Forums
 *     summary: Create Questions
 *     description: Create new questions in the forum
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/QuestionSchema"
 *     responses:
 *       "201":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewQuestionSchema"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
ForumsRouter.get('/', ForumsController.listQuestions)

ForumsRouter.get('/:id', ForumsController.viewQuestion)

ForumsRouter.post(
  '/',
  upload.array('imagesrc'),
  ForumsController.createNewQuestion
)

ForumsRouter.post(
  '/create/answers/:id',
  UserGuard(['user']),
  ForumsController.createNewAnswer
)

ForumsRouter.post(
  '/create/comments/:answerId',
  UserGuard(['user']),
  ForumsController.createNewComment
)
