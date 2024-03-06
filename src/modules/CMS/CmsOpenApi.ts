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
