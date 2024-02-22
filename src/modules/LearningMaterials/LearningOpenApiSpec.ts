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
 *
 *
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     PublishedLearningMaterial:
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
 *         thumbnail:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             resource:
 *               type: string
 *             type:
 *               type: string
 *           required:
 *             - id
 *             - resource
 *             - type
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               tag:
 *                 type: string
 *       required:
 *         - id
 *         - title
 *         - status
 *         - createdat
 *         - updatedat
 *         - thumbnail
 *         - tags
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
 *         multipart/form-data:
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
 * /api/learning/update/resource/{id}:
 *   put:
 *     summary: Update a resource for a learning material
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
 *         multipart/form-data:
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
 *         image:
 *           type: string
 *           format: binary
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

/**
 * @openapi
 * /api/learning/create/credits/{id}:
 *   post:
 *     summary: Create learning credits
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
 *             $ref: "#/components/schemas/NewLearningCredits"
 *     responses:
 *       "201":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateLearningCreditsResponse"
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
 * /api/learning/update/credits/{id}:
 *   put:
 *     summary: Update learning credits
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
 *             $ref: "#/components/schemas/NewLearningCredits"
 *     responses:
 *       "201":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateLearningCreditsResponse"
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
 *     NewLearningCredits:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         title:
 *           type: string
 *       required:
 *         - name
 *         - title
 *
 *     CreateLearningCreditsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/LearningCredits"
 *       required:
 *         - message
 *         - data
 *
 *     LearningCredits:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         learning_id:
 *           type: string
 *         name:
 *           type: string
 *         title:
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
 *         - title
 *         - createdat
 *         - updatedat
 */

/**
 * @openapi
 * /api/learning/remove/credits/{id}:
 *   delete:
 *     summary: Remove learning credits
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the learning credits
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RemoveLearningCreditsResponse"
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
 *     RemoveLearningCreditsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */

/**
 * @openapi
 * /api/learning/create/tags/{id}:
 *   post:
 *     summary: Remove tags from learning material
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
 *             $ref: "#/components/schemas/NewLearningTags"
 *     responses:
 *       "201":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateLearningTagsResponse"
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
 *     NewLearningTags:
 *       type: object
 *       properties:
 *         tags:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: string
 *             - type: string
 *       required:
 *         - tags
 *
 *     CreateLearningTagsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/LearningTag"
 *       required:
 *         - message
 *         - data
 *
 *     LearningTag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         learning_id:
 *           type: string
 *         tag_id:
 *           type: string
 *       required:
 *         - id
 *         - learning_id
 *         - tag_id
 */

/**
 * @openapi
 * /api/learning/remove/tags/{id}:
 *   delete:
 *     summary: Remove tags from learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the learning material
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RemoveLearningTagsResponse"
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
 *     RemoveLearningTagsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */

/**
 * @openapi
 * /api/learning/view/{id}:
 *   get:
 *     summary: View a learning material by ID
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LearningMaterialViewResponse"
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
 * /api/learning/view/published/{id}:
 *   get:
 *     summary: View a learning material by ID
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LearningMaterialViewResponse"
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
 *     LearningMaterialViewResponse:
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
 *         learning_resource:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/LearningResource"
 *         learning_credits:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/LearningCredit"
 *         tags:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/LearningTag"
 *       required:
 *         - id
 *         - title
 *         - status
 *         - createdat
 *         - updatedat
 *
 *     LearningResource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         resource:
 *           type: string
 *         type:
 *           type: string
 *         is_featured:
 *           type: boolean
 *       required:
 *         - id
 *         - name
 *
 *     LearningCredit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         title:
 *           type: string
 *       required:
 *         - id
 *         - name
 *         - title
 *
 *     LearningTag:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tag:
 *           type: string
 *       required:
 *         - id
 *         - tag
 */

/**
 * @openapi
 * /api/learning/draft:
 *   get:
 *     summary: List draft learning materials
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query string (optional)
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
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListDraftLearningMaterialsResponse"
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
 * /api/learning/archive/list:
 *   get:
 *     summary: List archived learning materials
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query string (optional)
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
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListDraftLearningMaterialsResponse"
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
 * /api/learning/published:
 *   get:
 *     summary: List published learning materials
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query string (optional)
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
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListPublishedLearningMaterialsResponse"
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
 * /api/learning/related:
 *   get:
 *     summary: List related learning materials
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Tags to filter related materials by
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListRelatedLearningMaterialsResponse"
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
 *     ListDraftLearningMaterials:
 *       type: object
 *       properties:
 *         query:
 *           $ref: "#/components/schemas/ListDraftLearningMaterialsQuery"
 *       required:
 *         - query
 *
 *     ListDraftLearningMaterialsQuery:
 *       type: object
 *       properties:
 *         search:
 *           type: string
 *         page:
 *           type: string
 *         perpage:
 *           type: string
 *       required:
 *         - search
 *         - page
 *         - perpage
 *
 *     ListDraftLearningMaterialsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/LearningMaterial"
 *         pagination:
 *           $ref: "#/components/schemas/Pagination"
 *       required:
 *         - data
 *         - pagination
 *
 *     ListPublishedLearningMaterialsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/PublishedLearningMaterial"
 *         pagination:
 *           $ref: "#/components/schemas/Pagination"
 *       required:
 *         - data
 *         - pagination
 *
 *     ListRelatedLearningMaterialsResponse:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/PublishedLearningMaterial"
 *
 *     ListPublishedLearningMaterials:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/PublishedLearningMaterial"
 *         pagination:
 *           $ref: "#/components/schemas/Pagination"
 *       required:
 *         - data
 *         - pagination
 *
 */

/**
 * @openapi
 * /api/learning/publish/{id}:
 *   put:
 *     summary: Publish a learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the learning material to publish
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PublishLearningMaterialResponse"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     PublishLearningMaterialResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */

/**
 * @openapi
 * /api/learning/featured/{materialId}/{id}:
 *   put:
 *     summary: Set a learning material as featured
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: materialId
 *         required: true
 *         description: ID of the learning material
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the featured item
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SetFeaturedLearningMaterialResponse"
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
 *     SetFeaturedLearningMaterialResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */

/**
 * @openapi
 * /api/learning/unpublish/{id}:
 *   delete:
 *     summary: Unpublish a learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the learning material to be unpublished
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UnpublishLearningMaterialResponse"
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
 *     UnpublishLearningMaterialResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */

/**
 * @openapi
 * /api/learning/draft/delete/{id}:
 *   delete:
 *     summary: Delete a draft learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the draft learning material to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteDraftLearningMaterialResponse"
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
 *     DeleteDraftLearningMaterialResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */

/**
 *  @openapi
 * /api/learning/archive/{id}:
 *   delete:
 *     summary: Archive a learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the learning material to be archived
 *         schema:
 *           type: string
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
 *  @openapi
 * /api/learning/unarchive/{id}:
 *   put:
 *     summary: Unarchive a learning material
 *     tags:
 *       - LearningMaterials
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the learning material to be archived
 *         schema:
 *           type: string
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
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       required:
 *         - message
 */
