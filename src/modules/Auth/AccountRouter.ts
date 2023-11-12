import upload from '../../config/multer'
import * as AuthController from './AuthController'
import express from 'express'

export const AccountRouter = express.Router()

/**
 * @openapi
 * /api/account/signup:
 *   post:
 *     tags:
 *       - Account
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserRegisterSchema"
 *     responses:
 *       "201":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     message:
 *                       type: string
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
 */
AccountRouter.post('/signup', AuthController.registerUser)

/**
 * @openapi
 * /api/account/send-verification:
 *   post:
 *     tags:
 *       - Account
 *     summary: Send verification for user registration
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       "401":
 *         description: Unauthorized
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
AccountRouter.post('/send-verification', AuthController.sendEmailVerification)

/**
 * @openapi
 * /api/account/verify-email/{id}:
 *   get:
 *     tags:
 *       - Account
 *     summary: Verify email
 *     deprecated: true
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       "400":
 *         description: Token Expired
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
AccountRouter.get('/verify-email/:id', AuthController.verifyEmail)

/**
 * @openapi
 * /api/account/profile-completion:
 *   post:
 *     tags:
 *       - Account
 *     summary: Complete user details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserCompletionSchema"
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserAuthResponse"
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
 */

AccountRouter.post('/profile-completion', AuthController.profileCompletion)

/**
 * @openapi
 * /api/account/setup-profile:
 *   post:
 *     tags:
 *       - Account
 *     summary: Setup username and tags
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/UserProfile"
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserAuthResponse"
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
 */

AccountRouter.post(
  '/setup-profile',
  upload.single('avatar'),
  AuthController.setupUsernameAndTags
)
