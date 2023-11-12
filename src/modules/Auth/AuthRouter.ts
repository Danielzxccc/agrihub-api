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
