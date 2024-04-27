/**
 * @openapi
 * /api/community-farm/questions:
 *   post:
 *     summary: Create Community Farm Application Questions
 *     tags:
 *       - CommunityFarm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FarmQuestion"
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
 * components:
 *   schemas:
 *     FarmQuestion:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             nullable: true
 *             description: ID of the question (optional)
 *           farmid:
 *             type: string
 *             nullable: true
 *             description: ID of the farm (optional)
 *           question:
 *             type: string
 *             description: The question being posted
 */

/**
 * @openapi
 * /api/community-farm/questions/{id}:
 *   get:
 *     summary: Get Community Farm Questions by ID
 *     tags:
 *       - CommunityFarm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the community farm
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FarmQuestionItem"
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
 *     FarmQuestionItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the question
 *         farmid:
 *           type: string
 *           description: ID of the farm
 *         question:
 *           type: string
 *           description: The question being posted
 */

/**
 * @openapi
 * /api/community-farm/questions/{id}:
 *   delete:
 *     summary: Delete Community Farm Question by ID
 *     tags:
 *       - CommunityFarm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the question to delete
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
 * /api/community-farm/member/application/{id}:
 *   post:
 *     summary: Submit Membership Application for Community Farm
 *     tags:
 *       - CommunityFarm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the community farm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/FarmMemberApplication"
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
 * components:
 *   schemas:
 *     FarmMemberApplication:
 *       type: object
 *       properties:
 *         contact_person:
 *           type: string
 *           description: Name of the contact person applying for membership
 *         reason:
 *           type: string
 *           description: Reason for applying for membership
 *         answer:
 *           type: string
 *           description: Stringified answer object requested by the frontend.
 *         proof_selfie:
 *           type: string
 *           format: binary
 *           description: Selfie image of the applicant with id
 *         valid_id:
 *           type: string
 *           format: binary
 *           description: Valid ID image of the applicant
 */

/**
 * @openapi
 * /api/community-farm/member/applications/{id}:
 *   get:
 *     summary: Get Membership Applications for Community Farm
 *     tags:
 *       - CommunityFarm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the community farm
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page (optional)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *            - pending
 *            - accepted
 *            - rejected
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListApplicationsResponse"
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
 *     ListApplicationsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FarmerApplication"
 *           description: List of farmer applications
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     FarmerApplication:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the membership application
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: Date and time of application creation
 *         updatedat:
 *           type: string
 *           format: date-time
 *           description: Date and time of last update
 *         userid:
 *           type: string
 *           description: ID of the user who applied
 *         status:
 *           type: string
 *           description: Current status of the application
 *         avatar:
 *           type: string
 *           description: URL of the user's avatar
 *         lastname:
 *           type: string
 *           description: Last name of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         present_address:
 *           type: string
 *           description: Present address of the user
 *         district:
 *           type: string
 *           description: District of the user
 *         answers:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FarmerAnswer"
 *           description: List of answers provided by the user
 *     FarmerAnswer:
 *       type: object
 *       properties:
 *         answer:
 *           type: string
 *           description: Answer provided by the user
 *         question:
 *           type: string
 *           description: Question associated with the answer
 */

/**
 * @openapi
 * /api/community-farm/member/application/update/{id}:
 *   put:
 *     summary: Update Membership Application Status for Community Farm
 *     tags:
 *       - CommunityFarm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the membership application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateApplicationStatusRequest"
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
 * components:
 *   schemas:
 *     UpdateApplicationStatusRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [rejected, accepted]
 *           description: New status for the membership application
 *           required: true
 *         remarks:
 *           type: string
 *           description: Remarks on the application status update
 */

/**
 * @openapi
 * /api/community-farm/member/application/view/{id}:
 *   get:
 *     summary: View Membership Application for Community Farm
 *     tags:
 *       - CommunityFarm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the membership application
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ViewApplicationResponse"
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
 *     ViewApplicationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the membership application
 *         farmid:
 *           type: string
 *           description: ID of the community farm
 *         userid:
 *           type: string
 *           description: ID of the user who applied
 *         contact_person:
 *           type: string
 *           description: Contact person for the application
 *         proof_selfie:
 *           type: string
 *           description: URL of the selfie provided as proof
 *         valid_id:
 *           type: string
 *           description: URL of the valid ID provided
 *         reason:
 *           type: string
 *           description: Reason for applying
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: Date and time of application creation
 *         updatedat:
 *           type: string
 *           format: date-time
 *           description: Date and time of last update
 *         status:
 *           type: string
 *           description: Current status of the application
 *         remarks:
 *           type: string
 *           nullable: true
 *           description: Additional remarks or notes
 */

/**
 * @openapi
 * /api/community-farm/member/application/cancel/{id}:
 *   delete:
 *     summary: Delete Community Farmer Application by ID
 *     tags:
 *       - CommunityFarm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the application to delete
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
 * /api/community-farm/member/application/existing:
 *   get:
 *     summary: Get Existing Membership Application
 *     tags:
 *       - CommunityFarm
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmerApplication"
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
 * /api/community-farm/member/application/existing:
 *   get:
 *     summary: Get Existing Membership Application
 *     tags:
 *       - CommunityFarm
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ExistingFarmerApplication"
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
 *     ExistingFarmerApplication:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID of the membership application
 *         farmid:
 *           type: string
 *           description: ID of the community farm
 *         userid:
 *           type: string
 *           description: ID of the user who applied
 *         contact_person:
 *           type: string
 *           description: Contact person for the application
 *         proof_selfie:
 *           type: string
 *           description: URL of the proof selfie
 *         valid_id:
 *           type: string
 *           description: URL of the valid ID
 *         reason:
 *           type: string
 *           description: Reason for the application
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: Date and time of application creation
 *         updatedat:
 *           type: string
 *           format: date-time
 *           description: Date and time of last update
 *         status:
 *           type: string
 *           description: Current status of the application
 *         remarks:
 *           type: string
 *           description: Remarks for the application
 */

/**
 * @openapi
 * /api/community-farm/crop/report/planted/{id}:
 *   post:
 *     summary: Submit planted crop report
 *     tags:
 *       - CommunityFarmReports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community farm
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/PlantedCropReportFormData"
 *           example:
 *             planted_qty: "100"
 *             date_planted: "2024-04-28"
 *             crop_id: "123"
 *             images: [binary1, binary2]
 *     responses:
 *       "200":
 *         description: Submitted successfully
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
 *     PlantedCropReportFormData:
 *       type: object
 *       properties:
 *         planted_qty:
 *           type: string
 *         date_planted:
 *           type: string
 *         crop_id:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *       required:
 *         - planted_qty
 *         - date_planted
 *         - crop_id
 */

/**
 * @openapi
 * /api/community-farm/crop/reports/{id}:
 *   get:
 *     summary: Get planted crop reports by Farm id
 *     tags:
 *       - CommunityFarmReports
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
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityCropReportsResponseV2"
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
 *     PlantedCropsResponse:
 *       type: object
 *       properties:
 *         report_id:
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
 *         growth_span:
 *           type: string
 *         expected_harvest_date:
 *           type: string
 *         image:
 *           type: string
 *           format: uri
 *     CommunityCropReportsResponseV2:
 *       type: object
 *       properties:
 *         reports:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/PlantedCropsResponse"
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: number
 *             per_page:
 *               type: number
 *             total_pages:
 *               type: number
 *             total_records:
 *               type: number
 */
