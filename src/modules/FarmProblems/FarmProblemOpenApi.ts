/**
 * @openapi
 * /api/farm/problems/{id}:
 *   get:
 *     summary: Retrieve farm problem details by ID
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the farm problem to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmProblemResponse"
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
 *     FarmProblemResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         problem:
 *           type: string
 *         description:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         common:
 *           type: boolean
 *         is_archived:
 *           type: boolean
 *         learning_materials:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ProblemMaterials"
 *     ProblemMaterials:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         id:
 *           type: string
 *         fpm_id:
 *           type: string
 *         is_archived:
 *           type: boolean
 *         language:
 *           type: string
 *         published_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Tag"
 *         thumbnail:
 *           $ref: "#/components/schemas/Thumbnail"
 *         title:
 *           type: string
 *         type:
 *           type: string
 *         updatedat:
 *           type: string
 *           format: date-time
 *     Tag:
 *       type: object
 *       properties:
 *         tag:
 *           type: string
 *     Thumbnail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         resource:
 *           type: string
 *         type:
 *           type: string
 */

/**
 * @openapi
 * /api/farm/problems:
 *   post:
 *     summary: Create a new farm problem
 *     tags:
 *       - FarmProblems
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewFarmProblem"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmProblemPostResponse"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     NewFarmProblem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           nullable: true
 *         problem:
 *           type: string
 *         description:
 *           type: string
 *         common:
 *           type: boolean
 *         materials:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: string
 *             - type: string
 *     FarmProblemPostResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         problem:
 *           type: string
 *         description:
 *           type: string
 *         common:
 *           type: boolean
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/farm/problems/archive/{id}:
 *   delete:
 *     summary: Archive a problems
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the problem to be archived
 *         required: true
 *     responses:
 *       "200":
 *         description: Problem archived successfully
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
 * /api/farm/problems/unarchive/{id}:
 *   put:
 *     summary: Unarchive a problems
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the problem to be unarchived
 *         required: true
 *     responses:
 *       "200":
 *         description: Event Problem successfully
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
 * /api/farm/problems/material/{id}:
 *   delete:
 *     summary: Delete a problem material
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the material to be deleted
 *         required: true
 *     responses:
 *       "200":
 *         description: Event Problem successfully
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
 * /api/farm/problems/list:
 *   get:
 *     summary: Get a list of farm problems
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter problems by search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Apply additional filters
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmProblemListResponse"
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
 * /api/farm/problems/archived/list:
 *   get:
 *     summary: Get a list of farm problems
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter problems by search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Apply additional filters
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmProblemListResponse"
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
 *     FarmProblemListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FarmProblem"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     FarmProblem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         problem:
 *           type: string
 *         description:
 *           type: string
 *         common:
 *           type: boolean
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         is_archived:
 *           type: boolean
 */

/**
 * @openapi
 * /api/farm/problems/report:
 *   post:
 *     summary: Report a farm problem
 *     tags:
 *       - FarmProblems
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ReportRequestBody"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReportResponse"
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
 *     ReportRequestBody:
 *       type: object
 *       properties:
 *         problem_id:
 *           type: string
 *         date_noticed:
 *           type: string
 *         is_other:
 *           type: boolean
 *         problem:
 *           type: string
 *         description:
 *           type: string
 *     ReportResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         community_farm:
 *           type: string
 *         userid:
 *           type: string
 *         problem_id:
 *           type: string
 *         status:
 *           type: string
 *         date_noticed:
 *           type: string
 *           nullable: true
 *         date_solved:
 *           type: string
 *           nullable: true
 *         is_helpful:
 *           type: string
 *           nullable: true
 *         feedback:
 *           type: string
 *           nullable: true
 */

/**
 * @openapi
 * /api/farm/problems/community/list:
 *   get:
 *     summary: List community farm problems
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter problems
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [pending, resolved]
 *         description: Filter by problem status
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityFarmProblemListResponse"
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
 * /api/farm/problems/reported/list:
 *   get:
 *     summary: List reported farm problems
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter problems
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [pending, resolved]
 *         description: Filter by problem status
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityFarmProblemListResponse"
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
 *     CommunityFarmProblemListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/CommunityFarmProblem"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 *     CommunityFarmProblem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         status:
 *           type: string
 *         problem:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @openapi
 * /api/farm/problems/community/resolve/{id}:
 *   post:
 *     summary: Mark community farm problem as resolved
 *     tags:
 *       - FarmProblems
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the problem to mark as resolved
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MarkProblemAsResolvedRequest"
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
 *     MarkProblemAsResolvedRequest:
 *       type: object
 *       properties:
 *         is_helpful:
 *           type: boolean
 *         feedback:
 *           type: string
 */
