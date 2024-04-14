import { rateLimiter } from '../../middleware/RateLimitter'
import * as AuthController from './AuthController'
import express from 'express'

export const AuthRouter = express.Router()

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserLoginSchema"
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserAuthResponse"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
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
AuthRouter.post('/login', AuthController.authenticateUser)

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user from session
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSchema"
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
AuthRouter.get('/me', AuthController.getCurrentUser)

/**
 * @openapi
 * /api/auth/logout:
 *   delete:
 *     tags:
 *       - Auth
 *     summary: Delete session token form
 *     responses:
 *       "200":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               message:
 *               type: object
 *               properties:
 *                  message:
 *                    type: string
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
AuthRouter.delete('/logout', AuthController.logout)

AuthRouter.post('/reset-token', AuthController.sendResetToken)
AuthRouter.post('/reset-password/:token', AuthController.resetPassword)
AuthRouter.get('/check-token/:token', AuthController.checkResetTokenExpiration)

/**
 * @openapi
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ResetPasswordRequestBody"
 *     responses:
 *       "200":
 *         description: Success message
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
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Not Found Error
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

/**
 * @openapi
 * components:
 *   schemas:
 *     ResetPasswordRequestBody:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *         confirmPassword:
 *           type: string
 */

/**
 * @openapi
 * /api/auth/reset-token:
 *   post:
 *     summary: Send reset token to user's email
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SendResetTokenRequestBody"
 *     responses:
 *       "200":
 *         description: Success message
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
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Not Found Error
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

/**
 * @openapi
 * components:
 *   schemas:
 *     SendResetTokenRequestBody:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 */

/**
 * @openapi
 * /api/auth/check-token/{token}:
 *   get:
 *     summary: Check token validity
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Success message
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
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Not Found Error
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

AuthRouter.post('/verify-otp', AuthController.verifyOTP)
AuthRouter.post(
  '/send-otp',
  // rateLimiter({
  //   endpoint: '/api/auth/send-otp',
  //   rate_limit: { limit: 1, time: 60 },
  // }),
  AuthController.sendOTP
)
AuthRouter.post('/reset-token/otp', AuthController.sendResetTokenViaOTP)
AuthRouter.post('/verify-token/otp', AuthController.verifyResetTokenViaOTP)

AuthRouter.post('/confirm/password', AuthController.confirmPassword)
AuthRouter.post('/update/email', AuthController.updateUserEmail)

AuthRouter.get(
  '/confirm/email-update/:id',
  AuthController.confirmChangeEmailRequest
)

AuthRouter.post('/update/number', AuthController.updateUserNumber)
AuthRouter.post(
  '/confirm/number-update',
  AuthController.confirmChangeNumberRequest
)
