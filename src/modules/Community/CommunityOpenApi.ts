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
 *               $ref: "#/components/schemas/ApplicationListResponse"
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
 *     ApplicationListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ApplicationFarmMember"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     ApplicationFarmMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Application ID
 *           required: true
 *         createdat:
 *           type: string
 *           description: Date and time of application creation
 *           required: true
 *         updatedat:
 *           type: string
 *           description: Date and time of application update
 *           required: true
 *         userid:
 *           type: string
 *           description: User ID of the applicant
 *           required: true
 *         avatar:
 *           type: string
 *           description: URL of the applicant's avatar
 *           required: true
 *         lastname:
 *           type: string
 *           description: Last name of the applicant
 *           required: true
 *         username:
 *           type: string
 *           description: Username of the applicant
 *           required: true
 *         email:
 *           type: string
 *           description: Email address of the applicant
 *           required: true
 *         present_address:
 *           type: string
 *           description: Present address of the applicant
 *           required: true
 *         district:
 *           type: string
 *           description: District of the applicant
 *           required: true
 */
