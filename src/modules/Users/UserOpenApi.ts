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
