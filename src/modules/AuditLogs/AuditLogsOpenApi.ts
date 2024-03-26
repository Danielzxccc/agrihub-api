/**
 * @openapi
 * /api/audit-logs:
 *   get:
 *     summary: Get Audit Logs
 *     tags:
 *       - AuditLogs
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *         required: false
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *         required: false
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/AuditLog"
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
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         action:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         userid:
 *           type: string
 *         section:
 *           type: string
 *         avatar:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         username:
 *           type: string
 *         role:
 *           type: string
 *         email:
 *           type: string
 */
