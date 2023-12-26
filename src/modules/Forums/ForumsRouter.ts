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
 *       - in: query
 *         name: profile
 *         schema:
 *           type: string
 *         description: profile query
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
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *            - newest
 *            - top
 *         description: Filter criteria (optional, default newest)
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuestionViewSchema"
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
 *       "201":
 *         description: Successful vote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VoteResponseSchema"
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

/**
 * @openapi
 * /api/forums/create/answers/{id}:
 *   post:
 *     summary: Create a new answer in the forum
 *     tags:
 *       - Forums
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AnswersSchema"
 *     responses:
 *       "201":
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewAnswerResponse"
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

/**
 * @openapi
 * /api/forums/create/comments/{answerId}:
 *   post:
 *     summary: Create a comment for an answer in the forum
 *     tags:
 *       - Forums
 *     parameters:
 *       - name: answerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CommentsSchema"
 *     responses:
 *       "200":
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewCommentResponse"
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

/**
 * @openapi
 * /api/forums/vote/answer/{id}:
 *   post:
 *     summary: Vote for an answer in the forum
 *     tags:
 *       - Forums
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VoteAnswerSchema"
 *     responses:
 *       "201":
 *         description: Voted Answer Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VoteAnswerSuccessResponse"
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
