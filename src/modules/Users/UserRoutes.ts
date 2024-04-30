import upload from '../../config/multer'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
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
  UserGuard(['admin', 'asst_admin', 'member', 'farmer', 'farm_head']),
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

UserRouter.get(
  '/admins',
  AccessGuard('admin'),
  UserGuard(['admin', 'asst_admin']),
  UserController.listAdmins
)

UserRouter.delete(
  '/admin/disable/:id',
  AccessGuard('admin'),
  UserGuard(['admin', 'asst_admin']),
  UserController.disableAdminAccount
)

UserRouter.post(
  '/admin/enable/:id',
  AccessGuard('admin'),
  UserGuard(['admin', 'asst_admin']),
  UserController.enableAdminAccount
)

UserRouter.post(
  '/report',
  UserGuard(['admin', 'asst_admin', 'farmer', 'farm_head', 'member']),
  upload.array('evidence'),
  UserController.reportUser
)

UserRouter.get(
  '/reported',
  AccessGuard('users'),
  UserGuard(['admin', 'asst_admin']),
  UserController.listReportedUsers
)

UserRouter.post(
  '/ban/:id',
  AccessGuard('users'),
  UserGuard(['admin', 'asst_admin']),
  UserController.banUserAccount
)

UserRouter.post(
  '/unban/:id',
  AccessGuard('users'),
  UserGuard(['admin', 'asst_admin']),
  UserController.unbanUserAccount
)

UserRouter.get(
  '/banned',
  AccessGuard('users'),
  UserGuard(['admin', 'asst_admin']),
  UserController.listBannedUsers
)

UserRouter.post(
  '/warn/:id',
  AccessGuard('users'),
  UserGuard(['admin', 'asst_admin']),
  UserController.sendingWarningToUser
)

UserRouter.delete('/delete/avatar', UserController.deleteUserProfilePicture)
UserRouter.put('/update/tags', UserController.updateUserTags)
UserRouter.get('/tags', UserController.findUserPreferredTags)
