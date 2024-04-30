/**
 * @openapi
 * /api/analytics/latest/harvest-rate/{id}:
 *   post:
 *     summary: Calculate latest harvest rate analytics
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user or farm
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Latest harvest rate calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/HarvestRateResponse"
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
 *     HarvestRateResponse:
 *       type: object
 *       properties:
 *         plant:
 *           type: string
 *         message:
 *           type: string
 *         latestHarvestRate:
 *           type: string
 *         pastHarvestRate:
 *           type: string
 *       required:
 *         - plant
 *         - message
 *         - latestHarvestRate
 *         - pastHarvestRate
 *       example:
 *         plant: Kamatis
 *         message: "You are -4.00% in harvest rate compared to your previous harvest"
 *         latestHarvestRate: "24.00"
 *         pastHarvestRate: "28.00"
 */
