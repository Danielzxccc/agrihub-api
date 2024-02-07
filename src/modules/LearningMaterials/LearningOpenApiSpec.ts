/**
 * @openapi
 * /api/learning/create/draft:
 *   post:
 *     summary: Create a draft learning material
 *     tags:
 *       - LearningMaterials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewLearningMaterial"
 *     responses:
 *       "201":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateDraftResponse"
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
 *     NewLearningMaterial:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *       required:
 *         - title
 *
 *     CreateDraftResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/LearningMaterial"
 *       required:
 *         - message
 *         - data
 *
 *     LearningMaterial:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         context:
 *           type: string
 *         type:
 *           type: string
 *         language:
 *           type: string
 *         status:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - title
 *         - status
 *         - createdat
 *         - updatedat
 */

/**
 *  @openapi
 * /api/learning/create/draft:
 *   put:
 *     summary: Update a draft learning material
 *     tags:
 *       - LearningMaterials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateLearningMaterial"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateDraftResponse"
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
 *     UpdateLearningMaterial:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           nullable: true
 *         content:
 *           type: string
 *           nullable: true
 *         type:
 *           type: string
 *           nullable: true
 *         language:
 *           type: string
 *           nullable: true
 *
 *     UpdateDraftResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/LearningMaterial"
 *       required:
 *         - message
 *         - data
 *
 *     LearningMaterial:
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
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - title
 *         - status
 *         - createdat
 *         - updatedat
 */
