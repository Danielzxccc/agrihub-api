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
 * /api/learning/update/draft/{id}:
 *   put:
 *     summary: Update a draft learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the learning resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateLearningMaterial"
 *     responses:
 *       "201":
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

/**
 * @openapi
 * /api/learning/create/resource/{id}:
 *   post:
 *     summary: Create a resource for a learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the learning material
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewLearningResource"
 *     responses:
 *       "201":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateResourceResponse"
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
 *     NewLearningResource:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         resource:
 *           type: string
 *         type:
 *           type: string
 *       required:
 *         - name
 *
 *     CreateResourceResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/LearningResource"
 *       required:
 *         - message
 *         - data
 *
 *     LearningResource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         learning_id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         resource:
 *           type: string
 *         type:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - learning_id
 *         - name
 *         - createdat
 *         - updatedat
 */

/**
 * @openapi
 * /api/learning/remove/resource/{id}:
 *   delete:
 *     summary: Remove a resource from a learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the resource
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RemoveResourceResponse"
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
 *     RemoveResourceResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */
