/**
 * @openapi
 * /api/notification/user:
 *   get:
 *     summary: Get user notifications
 *     tags:
 *       - Notification
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search query
 *       - name: page
 *         in: query
 *         schema:
 *           type: string
 *         description: Page number
 *       - name: perpage
 *         in: query
 *         schema:
 *           type: string
 *         description: Items per page
 *       - name: filter
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter criteria
 *     responses:
 *       "200":
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/UserNotificationResponse"
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
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UserNotificationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         emitted_to:
 *           type: string
 *         body:
 *           type: string
 *         redirect_to:
 *           type: string
 *         viewed:
 *           type: boolean
 *         createdat:
 *           type: string
 *         updatedat:
 *           type: string
 */

/**
 * @openapi
 * /api/notification/user/read/{id}:
 *   put:
 *     summary: Mark a user notification as read
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to mark as read
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReadNotificationResponse"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     ReadNotificationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */

/**
 * @openapi
 * /api/notification/read/all:
 *   post:
 *     summary: Mark All Notifications as Read
 *     tags:
 *       - Notification
 *     requestBody:
 *       required: false
 *     responses:
 *       "200":
 *         description: Successful response
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
