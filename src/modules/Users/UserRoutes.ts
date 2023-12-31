import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
import * as UserController from './UserController'
import express from 'express'

export const UserRouter = express.Router()

/**
 * @openapi
 * /api/user/profile/{username}:
 *   get:
 *     tags:
 *       - User
 *     summary: Search User
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Search key
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSchema"
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
UserRouter.get('/profile/:username', UserController.findUserProfile)

// TODO: fix edit profile
/**
 * @openap
 * /api/user/profile/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user profile
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/UserUpdateProfile"
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TagsSchema"
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

UserRouter.put(
  '/profile/:id',
  UserGuard(['user']),
  upload.single('avatar'),
  UserController.updateUserProfile
)
