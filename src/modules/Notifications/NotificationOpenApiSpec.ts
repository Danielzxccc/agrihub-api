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
