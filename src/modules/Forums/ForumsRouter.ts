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

/**
 * @openapi
 * /api/forums/{id}:
 *   get:
 *     tags:
 *       - "Forums"
 *     summary: Get Question Details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuestionViewSchema"
 */

ForumsRouter.get('/:id', ForumsController.viewQuestion)

/**
 * @openapi
 * /api/forums/vote/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *   post:
 *     tags:
 *       - "Forums"
 *     summary: Upvote or Downvote Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum:
 *                  - upvote
 *                  - downvote
 *             required:
 *               - type
 *     responses:
 *       "200":
 *         description: Successful vote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VoteResponseSchema"
 */

ForumsRouter.post(
  '/vote/:id',
  UserGuard(['member']),
  ForumsController.voteQuestion
)

ForumsRouter.post(
  '/',
  upload.array('imagesrc'),
  ForumsController.createNewQuestion
)

ForumsRouter.post(
  '/create/answers/:id',
  UserGuard(['member']),
  ForumsController.createNewAnswer
)

ForumsRouter.post(
  '/create/comments/:answerId',
  UserGuard(['member']),
  ForumsController.createNewComment
)
