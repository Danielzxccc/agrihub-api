/**
 * @openapi
 * /api/cms/landing/details:
 *   get:
 *     summary: Retrieve landing page details
 *     tags:
 *       - CMS
 *     responses:
 *       "200":
 *         description: Landing page details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LandingPageDetailsResponse"
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
 *     LandingPageDetailsResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         cta_header:
 *           type: string
 *         cta_description:
 *           type: string
 *         approach:
 *           type: string
 *         updatedat:
 *           type: string
 *         createdat:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CMSImage"
 *         approach_items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Approach"
 *     CMSImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         image:
 *           type: string
 *         index:
 *           type: integer
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Approach:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           description: Description of the approach.
 *         icon:
 *           type: string
 *           description: Icon associated with the approach.
 *         id:
 *           type: string
 *           description: Unique identifier for the approach.
 *         title:
 *           type: string
 *           description: Title of the approach.
 */

/**
 * @openapi
 * /api/cms/landing/create/image:
 *   post:
 *     summary: Add image to landing page
 *     tags:
 *       - CMS
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Image successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LandingPageImageResponse"
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
 *     LandingPageImageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         addImage:
 *           $ref: "#/components/schemas/LandingPageImage"
 *     LandingPageImage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         landing_id:
 *           type: string
 *         index:
 *           type: string
 *         images:
 *           type: string
 *         createdat:
 *           type: string
 *         updatedat:
 *           type: string
 *         imagesrc:
 *           type: string
 */

/**
 * @openapi
 * /api/cms/landing/delete/image/{id}:
 *   delete:
 *     summary: Delete image from landing page
 *     tags:
 *       - CMS
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Image successfully deleted
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
 * /api/cms/landing/update:
 *   put:
 *     summary: Update landing page details
 *     tags:
 *       - CMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateLandingRequest"
 *     responses:
 *       "200":
 *         description: Landing page details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateLandingResponse"
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
 * /api/cms/landing/update/approach:
 *   post:
 *     summary: Update landing page approach section
 *     tags:
 *       - CMS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateApproachRequest"
 *     responses:
 *       "200":
 *         description: Approach section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateApproachResponse"
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
 *     UpdateApproachRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         icon:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - id
 *         - icon
 *         - title
 *         - description
 *     UpdateApproachResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/ApproachSection"
 *     ApproachSection:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         icon:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateLandingRequest:
 *       type: object
 *       properties:
 *         cta_header:
 *           type: string
 *         cta_description:
 *           type: string
 *         approach:
 *           type: string
 *     UpdateLandingResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/LandingPageDetails"
 *     LandingPageDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         cta_header:
 *           type: string
 *         cta_description:
 *           type: string
 *         approach:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *       required:
 *         - cta_header
 *         - cta_description
 *         - approach
 *         - createdat
 *         - updatedat
 */

/**
 * @openapi
 * /api/cms/landing/delete/approach/{id}:
 *   delete:
 *     summary: Delete approach from landing page
 *     tags:
 *       - CMS
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Approach successfully deleted
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
