import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
import * as UserController from './UserController'
import express from 'express'

export const UserRouter = express.Router()

/**
 * @openapi
 * /api/user/list:
 *   get:
 *     summary: Get a list of users
 *     tags:
 *       - User
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search term for filtering users
 *       - name: page
 *         in: query
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *       - name: perpage
 *         in: query
 *         schema:
 *           type: string
 *         description: Number of records per page
 *       - name: filter
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter criteria for users
 *     responses:
 *       "200":
 *         description: Success. Returns a list of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListUserResponse"
 *       "401":
 *         description: Unauthorized
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

UserRouter.get(
  '/list',
  UserGuard(['admin', 'asst_admin']),
  UserController.listUsers
)

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
 * @openapi
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
 *               $ref: "#/components/schemas/MessageResponse"
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
  UserGuard(['member', 'farmer', 'farm_head']),
  upload.single('avatar'),
  UserController.updateUserProfile
)

/**
 * @openapi
 * /api/user/search/members:
 *   get:
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           default: ""
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *           default: "20"
 *         description: Items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           default: ""
 *         description: Filter criteria
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListMemberResponse"
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
UserRouter.get(
  '/search/members',
  UserGuard(['farm_head']),
  UserController.listMembers
)
