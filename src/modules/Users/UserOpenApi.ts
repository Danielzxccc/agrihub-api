/**
 * @openapi
 * /api/user/admins:
 *   get:
 *     summary: Get a list of administrators
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query string
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *            - active
 *            - banned
 *         description: Filter by banned or active administrators
 *         default: active
 *     responses:
 *       "200":
 *         description: A list of administrators
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AdminListResponse"
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
 *     AdminListResponse:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/AdminUser"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     AdminUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date-time
 *         present_address:
 *           type: string
 *         avatar:
 *           type: string
 *         zipcode:
 *           type: string
 *         district:
 *           type: string
 *         municipality:
 *           type: string
 *         verification_level:
 *           type: string
 *         bio:
 *           type: string
 *         role:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         isbanned:
 *           type: boolean
 *         farm_id:
 *           type: string
 */

/**
 * @openapi
 * /api/user/admin/disable/{id}:
 *   delete:
 *     summary: Disable Admin Account
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the event to be archived
 *         required: true
 *     responses:
 *       "200":
 *         description: Account disabled successfully
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
 * /api/user/admin/enable/{id}:
 *   post:
 *     summary: Enable Admin Account
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the event to be archived
 *         required: true
 *     responses:
 *       "200":
 *         description: Account disabled successfully
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
 * /api/user/report:
 *   post:
 *     summary: Report a user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/NewReportedUser"
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
 *     NewReportedUser:
 *       type: object
 *       properties:
 *         reported:
 *           type: string
 *         reason:
 *           type: string
 *         evidence:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 */

/**
 * @openapi
 * /api/user/reported:
 *   get:
 *     summary: List reported users
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         required: false
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *            - pending
 *            - warned
 *         description: Filter by banned or active administrators
 *         default: pending
 *     responses:
 *       "200":
 *         description: List of reported users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/ReportedUser"
 *                 pagination:
 *                   $ref: "#/components/schemas/PaginationData"
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
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ReportedUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         reason:
 *           type: string
 *         evidence:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         reported:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *             username:
 *               type: string
 *         reported_by:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *             username:
 *               type: string
 */

/**
 * @openapi
 * /api/user/ban/{id}:
 *   post:
 *     summary: Ban User Account
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the user to be banned
 *         required: true
 *     responses:
 *       "200":
 *         description: Account banned successfully
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
 * /api/user/unban/{id}:
 *   post:
 *     summary: Unban User Account
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the user to be unbanned
 *         required: true
 *     responses:
 *       "200":
 *         description: Account unbanned successfully
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
 * /api/user/banned:
 *   get:
 *     summary: Get a list of banned users
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query string
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *     responses:
 *       "200":
 *         description: A list of banned users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AdminListResponse"
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
 * /api/user/warn/{id}:
 *   post:
 *     summary: Send Warning To A User Account
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the report to be warned
 *         required: true
 *     responses:
 *       "200":
 *         description: Account warned successfully
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
 * /api/user/delete/avatar:
 *   delete:
 *     summary: Delete User Avatar
 *     tags:
 *       - User
 *     responses:
 *       "200":
 *         description: Successful response
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
 * /api/user/update/tags:
 *   put:
 *     summary: Update user tags
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserTagsUpdate"
 *           example:
 *             tags: ["tag1", "tag2"]
 *     responses:
 *       "200":
 *         description: Tags updated successfully
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
 *     UserTagsUpdate:
 *       type: object
 *       properties:
 *         tags:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: string
 *             - type: string
 */

/**
 * @openapi
 * /api/user/tags:
 *   get:
 *     summary: Get user tags
 *     tags:
 *       - User
 *     responses:
 *       "200":
 *         description: List of user tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/UserTag"
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
 *     UserTag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userid:
 *           type: string
 *         tagid:
 *           type: string
 *         tag_name:
 *           type: string
 */
