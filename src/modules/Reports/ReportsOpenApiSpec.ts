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
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting parameter
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
 * components:
 *   schemas:
 *     CommunityCropReportResponseItem:
 *       type: object
 *       properties:
 *         crop_id:
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
 *         farmid:
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
 *         crop_id:
 *           type: string
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
