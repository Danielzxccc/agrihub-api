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
 *         is_other:
 *           type: boolean
 *         isyield:
 *           type: boolean
 *         c_name:
 *           type: string
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
 *         is_first_report:
 *           type: string
 *           optional: true
 *         kilogram:
 *           type: string
 *           optional: true
 *         report_id:
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
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Month for which to retrieve growth rate distribution
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Year for which to retrieve growth rate distribution
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
 * /api/reports/farmer/graph/piechart:
 *   get:
 *     summary: Get farmer graph piechart data
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmerGraphPiechartResponse"
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
 *     FarmerGraphPiechartResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           crop_name:
 *             type: string
 *           planted_quantity:
 *             type: string
 */

/**
 * @openapi
 * /api/reports/farmer/graph/total-harvest:
 *   get:
 *     summary: Get farmer graph total harvest data
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmerGraphTotalHarvestResponse"
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
 *     FarmerGraphTotalHarvestResponse:
 *       type: object
 *       properties:
 *         january:
 *           type: string
 *         february:
 *           type: string
 *         march:
 *           type: string
 *         april:
 *           type: string
 *         may:
 *           type: string
 *         june:
 *           type: string
 *         july:
 *           type: string
 *         august:
 *           type: string
 *         september:
 *           type: string
 *         october:
 *           type: string
 *         november:
 *           type: string
 *         december:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/farmer/graph/growth-harvest:
 *   get:
 *     summary: Get farmer graph growth harvest data
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Month for which to retrieve growth rate distribution
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Month for which to retrieve growth rate distribution
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmerGraphGrowthHarvestResponse"
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
 *     FarmerGraphGrowthHarvestResponse:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           crop_name:
 *             type: string
 *           avg_harvest_qty:
 *             type: string
 *           avg_growth_span:
 *             type: string
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
 *         total_kg:
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

/**
 *  @openapi
 * /api/reports/crop/report/{id}:
 *   get:
 *     summary: Get crop reports by ID
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the farm
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Month Term (1-12)
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Records per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of filters
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *            - asc
 *            - desc
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityCropReportsResponse"
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
 *  @openapi
 * /api/reports/crop/report/existing/{id}:
 *   get:
 *     summary: Get crop reports by ID
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the farm
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: Records per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of filters
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *            - asc
 *            - desc
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityCropReportsResponse"
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
 * /api/reports/crop/report/inactive/{id}:
 *   post:
 *     summary: Set report as inactive
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the report to be set as inactive
 *         required: true
 *     responses:
 *       "200":
 *         description: Event deleted successfully
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
 *     CommunityCropReportResponseItem:
 *       type: object
 *       properties:
 *         crop_id:
 *           type: string
 *         cfc_id:
 *           type: string
 *         crop_name:
 *           type: string
 *         date_planted:
 *           type: string
 *         date_harvested:
 *           type: string
 *         harvested_qty:
 *           type: string
 *         withered_crops:
 *           type: string
 *         planted_qty:
 *           type: string
 *         image:
 *           type: string
 *           format: uri
 *     CommunityCropReportsResponse:
 *       type: object
 *       properties:
 *         reports:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CommunityCropReportResponseItem"
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: string
 *             per_page:
 *               type: string
 *             total_pages:
 *               type: string
 *             total_records:
 *               type: string
 */

/**
 * @openapi
 * /api/reports/crop/report/view/{id}:
 *   get:
 *     summary: Get crop report view by ID
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the crop report
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CropReportViewResponse"
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
 *     CropReportViewResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         cfc_id:
 *           type: string
 *         crop_name:
 *           type: string
 *         date_planted:
 *           type: string
 *         date_harvested:
 *           type: string
 *         harvested_qty:
 *           type: string
 *         withered_crops:
 *           type: string
 *         isyield:
 *           type: boolean
 *         farmid:
 *           type: string
 *         planted_qty:
 *           type: string
 *         image:
 *           type: string
 *           format: uri
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: uri
 */

/**
 *  @openapi
 * /api/reports/crop/growth-rate:
 *   get:
 *     summary: Get the growth rate of a crop
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GrowthRateResponse"
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
 *     GrowthRateResponse:
 *       type: object
 *       properties:
 *         results:
 *           type: string
 *         growth_rate:
 *           type: number
 *         average_growth_rate:
 *           type: number
 *       required:
 *         - result
 */

/**
 * @openapi
 * /api/reports/learning-materials:
 *   get:
 *     summary: Get learning materials report
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/LearningMaterialReport"
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
 *     LearningMaterialReport:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         type:
 *           type: string
 *         language:
 *           type: string
 *         status:
 *           type: string
 *         published_date:
 *           type: string
 *           format: date-time
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         is_archived:
 *           type: boolean
 *         learning_id:
 *           type: string
 *         tag_id:
 *           type: string
 *         details:
 *           type: string
 *         tag_name:
 *           type: string
 */

// rebuild

/**
 * @openapi
 * /api/reports/admin/graph/harvested-withered:
 *   get:
 *     summary: Retrieve harvested and withered data for a specific period
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: The year for which data is requested
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: The start date for the period
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         description: The end date for the period
 *     responses:
 *       "200":
 *         description: Array of harvested and withered data for each month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/HarvestedWitheredData"
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
 *     HarvestedWitheredData:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *         harvested:
 *           type: integer
 *         withered:
 *           type: integer
 */

/**
 * @openapi
 * /api/reports/admin/favourite/crops:
 *   get:
 *     summary: Retrieve data for favourite crops
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Array of favourite crops data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FavouriteCropData"
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
 *     FavouriteCropData:
 *       type: object
 *       properties:
 *         crop_name:
 *           type: string
 *         image:
 *           type: string
 *         total_planted:
 *           type: string
 *         total_harvested:
 *           type: string
 *         total_withered:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/admin/lowest/growth-rate:
 *   get:
 *     summary: Get farms with the lowest average growth rate
 *     parameters:
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *            - asc
 *            - desc
 *     tags: [Reports]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FarmWithGrowthRate"
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
 *     FarmWithGrowthRate:
 *       type: object
 *       properties:
 *         farm_id:
 *           type: string
 *           description: Unique identifier of the farm
 *         farm_name:
 *           type: string
 *           description: Name of the farm
 *         avatar:
 *           type: string
 *           description: Image of the farm
 *         avg_growth_rate:
 *           type: string
 *           description: Average growth rate of the farm
 */

/**
 * @openapi
 * /api/reports/admin/growth-rate/monthly:
 *   get:
 *     summary: Get monthly growth rate
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: The year to filter the data
 *         required: false
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: The start date to filter the data
 *         required: false
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *         description: The end date to filter the data
 *         required: false
 *     responses:
 *       "200":
 *         description: Monthly growth rate data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MonthlyGrowthRate"
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
 *     MonthlyGrowthRate:
 *       type: object
 *       properties:
 *         January:
 *           type: string
 *         February:
 *           type: string
 *         March:
 *           type: string
 *         April:
 *           type: string
 *         May:
 *           type: string
 *         June:
 *           type: string
 *         July:
 *           type: string
 *         August:
 *           type: string
 *         September:
 *           type: string
 *         October:
 *           type: string
 *         November:
 *           type: string
 *         December:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/admin/resources/count:
 *   get:
 *     summary: Get count of resources
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Count of resources
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResourceCount"
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
 *     ResourceCount:
 *       type: object
 *       properties:
 *         learning_materials:
 *           type: string
 *         events:
 *           type: string
 *         blogs:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/admin/resources/count/detailed:
 *   get:
 *     summary: Get detailed count of resources
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Detailed count of resources
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DetailedResourceCount"
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
 *     DetailedResourceCount:
 *       type: object
 *       properties:
 *         all_learning_materials:
 *           type: string
 *         draft_learning_material:
 *           type: string
 *         archived_learning_material:
 *           type: string
 *         events:
 *           type: string
 *         upcoming_events:
 *           type: string
 *         blogs:
 *           type: string
 *         draft_blogs:
 *           type: string
 *         archived_blogs:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/admin/farms/district:
 *   get:
 *     summary: Get farms count and total harvest by district
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Farms count and total harvest by district
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DistrictFarmData"
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
 *     DistrictFarmData:
 *       type: object
 *       properties:
 *         district_name:
 *           type: string
 *         total_farms:
 *           type: string
 *         total_harvest:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/farms/overview:
 *   get:
 *     summary: Get overview of farm reports
 *     tags:
 *       - FarmRequest
 *     responses:
 *       "200":
 *         description: Overview of farm reports
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmOverview"
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
 *     FarmOverview:
 *       type: object
 *       properties:
 *         pending_farm_applications:
 *           type: string
 *         accepted_requests:
 *           type: string
 *         total_farmers:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/forums/count:
 *   get:
 *     summary: Get count of forums, forum answers, and forum tags
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Count of forums, forum answers, and forum tags
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ForumCount"
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
 *     ForumCount:
 *       type: object
 *       properties:
 *         forums:
 *           type: string
 *         forums_answers:
 *           type: string
 *         forums_tags:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/forums/overview:
 *   get:
 *     summary: Get overview of forum questions and answers by month
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: The year to filter the overview
 *     responses:
 *       "200":
 *         description: Overview of forum questions and answers by month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ForumOverview"
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
 *     ForumOverview:
 *       type: object
 *       properties:
 *         month:
 *           type: string
 *         num_questions:
 *           type: string
 *         num_answers:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/common/overview:
 *   get:
 *     summary: Retrieve Common Overview Reports
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommonOverviewResponse"
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
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CommonOverviewResponse:
 *       type: object
 *       properties:
 *         pending_farm_applications:
 *           type: string
 *         community_farms:
 *           type: string
 *         seedling_requests:
 *           type: string
 *         pending_seedling_requests:
 *           type: string
 *         user_feedbacks:
 *           type: string
 *         unread_user_feedbacks:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/analytics/overview/piechart:
 *   get:
 *     summary: Retrieve Analytics Overview for Pie Chart
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AnalyticsOverviewPieChartResponse"
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
 *     AnalyticsOverviewPieChartResponse:
 *       type: object
 *       properties:
 *         seedling_requests:
 *           type: string
 *         pending_seedling_requests:
 *           type: string
 *         solved_farm_problems:
 *           type: string
 *         pending_farm_problems:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/analytics/overview/user-feedback:
 *   get:
 *     summary: Retrieve Analytics Overview for User Feedback
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AnalyticsOverviewUserFeedbackResponse"
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
 *     AnalyticsOverviewUserFeedbackResponse:
 *       type: object
 *       properties:
 *         very_satisfied:
 *           type: string
 *         satisfied:
 *           type: string
 *         neutral:
 *           type: string
 *         dissatisfied:
 *           type: string
 *         very_dissatisfied:
 *           type: string
 */

/**
 * @openapi
 * /api/forums/reported/questions:
 *   get:
 *     summary: Get Reported Questions in Forums
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: Number of items per page
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: "#/components/schemas/ReportedQuestionList"
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
 *     ReportedQuestionList:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/ReportedQuestion"
 *     ReportedQuestion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userid:
 *           type: string
 *         forumid:
 *           type: string
 *         reason:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         question:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         reported_username:
 *           type: string
 *         reported_firstname:
 *           type: string
 *         reported_userid:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/analytics/harvest/distribution:
 *   get:
 *     summary: Get Harvest Distribution Analytics
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month for which to retrieve harvest distribution
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Limit the number of results (default is 50)
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/HarvestDistribution"
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
 *     HarvestDistribution:
 *       type: object
 *       properties:
 *         farm_name:
 *           type: string
 *         farm_harvest_qty:
 *           type: string
 *         percentage_distribution:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/analytics/crop/distribution:
 *   get:
 *     summary: Get Crop Distribution Analytics
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month for which to retrieve crop distribution
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Limit the number of results (default is 50)
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CropDistribution"
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
 * /api/reports/analytics/crop/distribution/community:
 *   get:
 *     summary: Get Crop Distribution Analytics
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month for which to retrieve crop distribution
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Limit the number of results (default is 50)
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CropDistribution"
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
 *     CropDistribution:
 *       type: object
 *       properties:
 *         crop_id:
 *           type: string
 *         crop_name:
 *           type: string
 *         total_harvested_qty:
 *           type: string
 *         percentage_distribution:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/analytics/growth-rate/distribution:
 *   get:
 *     summary: Get Growth Rate Distribution Analytics
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month for which to retrieve growth rate distribution
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Limit the number of results (default is 50)
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/GrowthRateDistribution"
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
 *     GrowthRateDistribution:
 *       type: object
 *       properties:
 *         crop_name:
 *           type: string
 *         growth_rate:
 *           type: string
 *         percentage_distribution:
 *           type: string
 */

/**
 * @openapi
 * /api/reports/farm/inactive:
 *   get:
 *     summary: Get Inactive Farm Report
 *     tags:
 *       - Reports
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search term to filter farms
 *         schema:
 *           type: string
 *         example: ""
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: string
 *         example: "1"
 *       - name: perpage
 *         in: query
 *         description: Number of records per page
 *         schema:
 *           type: string
 *         example: "20"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InactiveFarmReport"
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
 *     InactiveFarmReport:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/InactiveFarmInfo"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     InactiveFarmInfo:
 *       type: object
 *       properties:
 *         farm_id:
 *           type: string
 *           description: The ID of the inactive farm
 *         farm_name:
 *           type: string
 *           description: The name of the inactive farm
 *         last_report_date:
 *           type: string
 *           format: date-time
 *           description: The date of the last report submitted for the farm
 *         months_since_last_report:
 *           type: string
 *           description: The number of months since the last report
 */

/**
 * @openapi
 * /api/reports/farm/land-size/analytics:
 *   get:
 *     summary: Get Farm Land Size Analytics by District
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmLandSizeAnalytics"
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
 *     FarmLandSizeAnalytics:
 *       type: object
 *       properties:
 *         District 1:
 *           type: string
 *           description: The total land size of farms in District 1
 *         District 2:
 *           type: string
 *           description: The total land size of farms in District 2
 *         District 3:
 *           type: string
 *           description: The total land size of farms in District 3
 *         District 4:
 *           type: string
 *           description: The total land size of farms in District 4
 *         District 5:
 *           type: string
 *           description: The total land size of farms in District 5
 *         District 6:
 *           type: string
 *           description: The total land size of farms in District 6
 */

/**
 * @openapi
 * /api/reports/farm/land-size/analytics/district:
 *   get:
 *     summary: Get Farm Land Size Analytics by District
 *     tags:
 *       - Reports
 *     parameters:
 *       - name: district
 *         in: query
 *         description: The district name (e.g., District 1, District 2, etc.)
 *         schema:
 *           type: string
 *           enum:
 *             [
 *               "District 1",
 *               "District 2",
 *               "District 3",
 *               "District 4",
 *               "District 5",
 *               "District 6",
 *             ]
 *         default: "District 1"
 *       - name: limit
 *         in: query
 *         description: The maximum number of results to return
 *         schema:
 *           type: integer
 *           format: int32
 *           default: 50
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FarmLandSizeByDistrict"
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
 *     FarmLandSizeByDistrict:
 *       type: object
 *       properties:
 *         farm_name:
 *           type: string
 *           description: The name of the farm
 *         size:
 *           type: string
 *           description: The land size of the farm
 */

/**
 * @openapi
 * /api/reports/analytics/pre-defined:
 *   get:
 *     summary: Get Pre-defined Messages
 *     tags:
 *       - Reports
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PreDefinedMessages"
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
 *     PreDefinedMessages:
 *       type: object
 *       properties:
 *         crop_yield:
 *           type: array
 *           items:
 *             type: string
 *           description: Pre-defined messages for crop yield
 *         net_yield:
 *           type: array
 *           items:
 *             type: string
 *           description: Pre-defined messages for net yield
 *         withered_reports:
 *           type: array
 *           items:
 *             type: string
 *           description: Pre-defined messages for withered reports
 */
