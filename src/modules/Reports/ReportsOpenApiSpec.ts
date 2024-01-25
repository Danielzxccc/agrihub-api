/**
 * @openapi
 * /api/reports/crop:
 *   post:
 *     summary: Submit a community crop report
 *     tags:
 *       - Reports
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/NewCommunityCropReport"
 *     responses:
 *       "201":
 *         description: Report submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CropReportResponse"
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
 *     NewCommunityCropReport:
 *       type: object
 *       properties:
 *         crop_id:
 *           type: string
 *         planted_qty:
 *           type: number
 *         harvested_qty:
 *           type: number
 *         withered_crops:
 *           type: number
 *         date_planted:
 *           type: string
 *           format: date-time
 *         date_harvested:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *           optional: true
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *
 *     CropReportData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         farmid:
 *           type: string
 *         userid:
 *           type: string
 *         crop_id:
 *           type: string
 *         planted_qty:
 *           type: number
 *         harvested_qty:
 *           type: number
 *         withered_crops:
 *           type: number
 *         date_planted:
 *           type: string
 *           format: date-time
 *         date_harvested:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *
 *     CropReportResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/CropReportData"
 */
