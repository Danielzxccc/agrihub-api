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
 *         image:
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

/**
 * @openapi
 * /api/reports/farmer/graph/stacked-bar:
 *   get:
 *     summary: Get stacked bar graph data for farmer reports
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmerGraphStackedBarResponse"
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
 *     FarmerGraphStackedBarResponse:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/FarmerGraphStackedBarData"
 *
 *     FarmerGraphStackedBarData:
 *       type: object
 *       properties:
 *         community_farms_crops_id:
 *           type: string
 *         farm_id:
 *           type: string
 *         crop_id:
 *           type: string
 *         crop_name:
 *           type: string
 *         total_harvested:
 *           type: string
 *         total_withered:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/farmer/total-harvested:
 *   get:
 *     summary: Get total harvested data for farmer reports
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmerTotalHarvestedResponse"
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
 *     FarmerTotalHarvestedResponse:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/FarmerTotalHarvestedData"
 *
 *     FarmerTotalHarvestedData:
 *       type: object
 *       properties:
 *         crop_id:
 *           type: string
 *         crop_name:
 *           type: string
 *         image:
 *           type: string
 *         total_harvested:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/crop/statistics/{name}:
 *   parameters:
 *     - name: name
 *       in: path
 *       required: true
 *       description: Crop name
 *       schema:
 *         type: string
 *   get:
 *     summary: Get crop statistics data for reports
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CropStatisticsResponse"
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
 *     CropStatisticsResponse:
 *       type: object
 *       properties:
 *         crop_id:
 *           type: string
 *         crop_name:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         report_count:
 *           type: string
 *         growth_span:
 *           type: string
 *         seedling_season:
 *           type: string
 *         planting_season:
 *           type: string
 *         harvest_season:
 *           type: string
 *         planted_quantity:
 *           type: string
 *         total_harvested:
 *           type: string
 *         total_withered:
 *           type: string
 *         net_yield:
 *           type: string
 *         crop_yield:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CropImage"
 *
 *     CropImage:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 */
