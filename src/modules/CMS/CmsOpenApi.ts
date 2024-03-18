/**
 * @openapi
 * /api/cms/client-details:
 *   get:
 *     summary: Retrieve client details from the CMS
 *     tags:
 *       - CMS
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientDetailsResponse"
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
 *     ClientDetailsResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *         email:
 *           type: string
 *         contact_number:
 *           type: string
 *         address:
 *           type: string
 *         mission:
 *           type: string
 *         vision:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         socials:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Social"
 *         partners:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Partner"
 *         members:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Member"
 *     Social:
 *       type: object
 *       properties:
 *         createdat:
 *           type: string
 *           format: date-time
 *         id:
 *           type: string
 *         link:
 *           type: string
 *         name:
 *           type: string
 *         updatedat:
 *           type: string
 *           format: date-time
 *     Partner:
 *       type: object
 *       properties:
 *         createdat:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         id:
 *           type: string
 *         logo:
 *           type: string
 *         name:
 *           type: string
 *         updatedat:
 *           type: string
 *           format: date-time
 *     Member:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         id:
 *           type: string
 *         image:
 *           type: string
 *         name:
 *           type: string
 *         position:
 *           type: string
 */

/**
 * @openapi
 * /api/cms/client-details:
 *   put:
 *     summary: Update client details in the CMS
 *     tags:
 *       - CMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateClientDetailsRequest"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateClientDetailsResponse"
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
 *     UpdateClientDetailsRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *         email:
 *           type: string
 *         contact_number:
 *           type: string
 *         address:
 *           type: string
 *         mission:
 *           type: string
 *         vision:
 *           type: string
 *         socials:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/SocialUpdate"
 *         partners:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/PartnerUpdate"
 *         members:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/MemberUpdate"
 *     UpdateClientDetailsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     SocialUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           nullable: true
 *         name:
 *           type: string
 *         link:
 *           type: string
 *     PartnerUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           nullable: true
 *         logo:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     MemberUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           nullable: true
 *         name:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         position:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 */

/**
 * @openapi
 * /api/cms/client-details/social/{id}:
 *   delete:
 *     summary: delete a social media in client details
 *     tags:
 *       - CMS
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the event to be Unpublished
 *         required: true
 *     responses:
 *       "200":
 *         description: Event Unpublished successfully
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
 * /api/cms/client-details/partner/{id}:
 *   delete:
 *     summary: delete a partner
 *     tags:
 *       - CMS
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the event to be Unpublished
 *         required: true
 *     responses:
 *       "200":
 *         description: Event Unpublished successfully
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
 * /api/cms/client-details/member/{id}:
 *   delete:
 *     summary: remove a member
 *     tags:
 *       - CMS
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the event to be Unpublished
 *         required: true
 *     responses:
 *       "200":
 *         description: Event Unpublished successfully
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
 * /api/privacy-policy/update:
 *   put:
 *     summary: Update Privacy Policy
 *     tags:
 *       - CMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdatePrivacyPolicyRequest"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdatePrivacyPolicyResponse"
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
 *     UpdatePrivacyPolicyRequest:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *     UpdatePrivacyPolicyResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             content:
 *               type: string
 *             createdat:
 *               type: string
 *               format: date-time
 *             updatedat:
 *               type: string
 *               format: date-time
 */

/**
 * @openapi
 * /api/privacy-policy:
 *   get:
 *     summary: Get Privacy Policy
 *     tags:
 *       - CMS
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PrivacyPolicyResponse"
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
 *     PrivacyPolicyResponse:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 */

/**
 * @openapi
 * /api/cms/user-feedback:
 *   post:
 *     summary: Submit User Feedback
 *     tags:
 *       - CMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewUserFeedback"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserFeedbackResponse"
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
 *     NewUserFeedback:
 *       type: object
 *       properties:
 *         feedback:
 *           type: string
 *         rating:
 *           type: number
 *
 *     UserFeedbackResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             userid:
 *               type: string
 *             feedback:
 *               type: string
 *             rating:
 *               type: string
 *             createdat:
 *               type: string
 *             updatedat:
 *               type: string
 */

/**
 * @openapi
 * /api/cms/user-feedbacks:
 *   get:
 *     summary: Retrieve User Feedbacks
 *     tags:
 *       - CMS
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
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserFeedbackListResponse"
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
 * /api/cms/user-feedbacks/{id}:
 *   get:
 *     summary: Retrieve User Feedback by ID
 *     tags:
 *       - CMS
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user feedback to retrieve
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserFeedback"
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
 *     UserFeedbackListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/UserFeedback"
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             per_page:
 *               type: integer
 *             total_pages:
 *               type: integer
 *             total_records:
 *               type: integer
 *
 *     UserFeedback:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userid:
 *           type: string
 *         feedback:
 *           type: string
 *         rating:
 *           type: string
 *         createdat:
 *           type: string
 *         updatedat:
 *           type: string
 *         is_read:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 */

/**
 * @openapi
 * /api/cms/vision-stats:
 *   get:
 *     summary: Retrieve Vision Statistics
 *     tags:
 *       - CMS
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VisionStatsResponse"
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
 *     VisionStatsResponse:
 *       type: object
 *       properties:
 *         community_farms:
 *           type: string
 *         registered_farmer:
 *           type: string
 *         forums_forums_answers:
 *           type: string
 *         total_resources:
 *           type: string
 */
