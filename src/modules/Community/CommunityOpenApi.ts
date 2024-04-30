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
 *         answers:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FarmerAnswer"
 *           description: List of answers provided by the user
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
 *         task_id:
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
 * /api/community-farm/crop/report/harvested/{id}:
 *   post:
 *     summary: Submit harvested crop report
 *     tags:
 *       - CommunityFarmReports
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the harvested crop report
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/HarvestedCropReportFormData"
 *           example:
 *             harvested_qty: "100"
 *             withered_crops: "20"
 *             date_harvested: "2024-04-28"
 *             notes: "Some optional notes"
 *             kilogram: "50"
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
 *     HarvestedCropReportFormData:
 *       type: object
 *       properties:
 *         harvested_qty:
 *           type: string
 *         withered_crops:
 *           type: string
 *         date_harvested:
 *           type: string
 *         notes:
 *           type: string
 *         kilogram:
 *           type: string
 *         task_id:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *       required:
 *         - harvested_qty
 *         - withered_crops
 *         - date_harvested
 *         - kilogram
 *         - images
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - planted
 *             - harvested
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *       - in: query
 *         name: previous_id
 *         schema:
 *           type: string
 *         description: Page number
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
 *         batch:
 *           type: string
 *           nullable: true
 *         previous_planted_qty:
 *           type: string
 *           nullable: true
 *         harvested_qty:
 *           type: string
 *         last_harvest_id:
 *           type: string
 *         withered_crops:
 *           type: string
 *         planted_qty:
 *           type: string
 *         harvested_by:
 *           type: string
 *         kilogram:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
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
 *         data:
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

/**
 * @openapi
 * /api/community-farm/task/planted/{id}:
 *   post:
 *     summary: Create new plant task
 *     tags:
 *       - CommunityFarmTasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plant task
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewPlantTask"
 *           example:
 *             crop_id: "123"
 *             due_date: "2024-04-28"
 *             message: "Optional message"
 *             assigned_to: "John Doe"
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
 *     NewPlantTask:
 *       type: object
 *       properties:
 *         crop_id:
 *           type: string
 *         due_date:
 *           type: string
 *         message:
 *           type: string
 *         assigned_to:
 *           type: string
 *       required:
 *         - crop_id
 *         - due_date
 *         - assigned_to
 *
 */

/**
 * @openapi
 * /api/community-farm/task/harvest/{id}:
 *   post:
 *     summary: Create new harvest task
 *     tags:
 *       - CommunityFarmTasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the harvest task
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewHarvestTask"
 *           example:
 *             report_id: "123"
 *             due_date: "2024-04-28"
 *             message: "Optional message"
 *             assigned_to: "John Doe"
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
 *     NewHarvestTask:
 *       type: object
 *       properties:
 *         report_id:
 *           type: string
 *         due_date:
 *           type: string
 *         message:
 *           type: string
 *         assigned_to:
 *           type: string
 *       required:
 *         - report_id
 *         - due_date
 *         - assigned_to
 */

/**
 * @openapi
 * /api/community-farm/task/list/{id}:
 *   get:
 *     summary: Get list of community tasks
 *     tags:
 *       - CommunityFarmTasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *             - completed
 *             - pending
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - plant
 *             - harvest
 *     responses:
 *       "200":
 *         description: List of community tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityTasksResponse"
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
 * /api/community-farm/task/list/farmer/{id}:
 *   get:
 *     summary: Get list of community tasks
 *     tags:
 *       - CommunityFarmTasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *             - completed
 *             - pending
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - plant
 *             - harvest
 *     responses:
 *       "200":
 *         description: List of community tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityTasksResponse"
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
 *     CommunityTask:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         farmid:
 *           type: string
 *         assigned_to:
 *           type: string
 *         report_id:
 *           type: string
 *           nullable: true
 *         crop_id:
 *           type: string
 *         due_date:
 *           type: string
 *           format: date-time
 *         task_type:
 *           type: string
 *           enum:
 *             - plant
 *             - harvest
 *         message:
 *           type: string
 *         action_message:
 *           type: string
 *         status:
 *           type: string
 *         crop_name:
 *           type: string
 *         username:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         role:
 *           type: string
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         per_page:
 *           type: integer
 *         total_pages:
 *           type: integer
 *         total_records:
 *           type: integer
 *
 *     CommunityTasksResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CommunityTask"
 *         pagination:
 *           $ref: "#/components/schemas/Pagination"
 */

/**
 * @openapi
 * /api/community-farm/task/delete/{id}:
 *   delete:
 *     summary: Delete a community task
 *     tags:
 *       - CommunityFarmTasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the task to delete
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Task deleted successfully
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
 * /api/community-farm/event/create:
 *   post:
 *     summary: Create a community event
 *     tags:
 *       - CommunityFarmEvents
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/CreateCommunityEventFormData"
 *           example:
 *             farmid: "123"
 *             title: "Farmers' Market"
 *             about: "Join us for the monthly farmers' market event!"
 *             start_date: "2024-05-01"
 *             end_date: "2024-05-02"
 *             type: "public"
 *             tags: ["market", "community"]
 *             banner: binary_data_here
 *     responses:
 *       "200":
 *         description: Event created successfully
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
 * /api/community-farm/event/update/{id}:
 *   put:
 *     summary: Update a community event
 *     tags:
 *       - CommunityFarmEvents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/UpdateCommunityEventFormData"
 *           example:
 *             title: "New Event Title"
 *             about: "Updated event description"
 *             start_date: "2024-05-01"
 *             end_date: "2024-05-02"
 *             type: "public"
 *             tags: ["updated", "community"]
 *             banner: binary_data_here
 *     responses:
 *       "200":
 *         description: Event updated successfully
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
 *     CreateCommunityEventFormData:
 *       type: object
 *       properties:
 *         farmid:
 *           type: string
 *         title:
 *           type: string
 *         about:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         type:
 *           type: string
 *           enum:
 *             - private
 *             - public
 *         tags:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: string
 *             - type: string
 *         banner:
 *           type: string
 *           format: binary
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateCommunityEventFormData:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         about:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         type:
 *           type: string
 *           enum:
 *             - private
 *             - public
 *         tags:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: string
 *             - type: string
 *         banner:
 *           type: string
 *           format: binary
 */

/**
 * @openapi
 * /api/community-farm/event/list/{id}:
 *   get:
 *     summary: Get list of community events
 *     tags:
 *       - CommunityFarmEvents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of events per page (optional)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - private
 *             - public
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *             - upcoming
 *             - previous
 *         description: Filter by event type (optional)
 *     responses:
 *       "200":
 *         description: List of community events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityEventsResponse"
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
 * /api/community-farm/event/list:
 *   get:
 *     summary: Get list of public community events
 *     tags:
 *       - CommunityFarmEvents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of events per page (optional)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - private
 *             - public
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *             - upcoming
 *             - previous
 *         description: Filter by event type (optional)
 *     responses:
 *       "200":
 *         description: List of community events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityEventsResponse"
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
 * /api/community-farm/event/view/{id}:
 *   get:
 *     summary: Get list of community events
 *     tags:
 *       - CommunityFarmEvents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: List of community events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityEvent"
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
 *     ListCommunityEvents:
 *       type: object
 *       properties:
 *         query:
 *           type: object
 *           properties:
 *             search:
 *               type: string
 *             page:
 *               type: string
 *             perpage:
 *               type: string
 *             type:
 *               type: string
 *               enum:
 *                 - private
 *                 - public
 *
 *     CommunityEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         farmid:
 *           type: string
 *         title:
 *           type: string
 *         about:
 *           type: string
 *         banner:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *           enum:
 *             - private
 *             - public
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         farm_name:
 *           type: string
 *         going:
 *           type: string
 *         interested:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/EventTag"
 *         action:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             type:
 *               type: string
 *
 *     CommunityEventsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CommunityEvent"
 *         pagination:
 *           $ref: "#/components/schemas/Pagination"
 */

/**
 * @openapi
 * /api/community-farm/event/delete/{id}:
 *   delete:
 *     summary: Delete a community event
 *     tags:
 *       - CommunityFarmEvents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to delete
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Event deleted successfully
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
 * /api/community-farm/event/action/{id}:
 *   post:
 *     summary: Perform an action on a community event
 *     tags:
 *       - CommunityFarmEvents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to perform action on
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EventAction"
 *           example:
 *             action: "going"
 *     responses:
 *       "200":
 *         description: Action performed successfully
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
 *     EventAction:
 *       type: object
 *       properties:
 *         action:
 *           type: string
 *           enum:
 *             - going
 *             - interested
 */
