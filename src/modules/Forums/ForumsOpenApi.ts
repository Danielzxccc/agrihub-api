/**
 * @openapi
 * /api/forums/save/question/{id}:
 *   post:
 *     summary: Save a question
 *     tags:
 *       - Forums
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the question to be saved
 *         required: true
 *     responses:
 *       "200":
 *         description: Saved Question Successfully
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
 * /api/forums/remove/saved/question/{id}:
 *   delete:
 *     summary: Remove a  saved question
 *     tags:
 *       - Forums
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the question to be removed
 *         required: true
 *     responses:
 *       "200":
 *         description: Removed Question Successfully
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
 * /api/forums/delete/question/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags:
 *       - Forums
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the question to be deleted
 *         required: true
 *     responses:
 *       "200":
 *         description: Deleted Question Successfully
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
 * /api/forums/saved/questions:
 *   get:
 *     tags:
 *       - Forums
 *     summary: Get Saved Questions Data
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for forums (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page (optional, default 10)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *            - newest
 *            - active
 *            - trending
 *         description: Filter criteria (optional, default newest)
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SavedQuestionsResponse"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "401":
 *         description: Unauthorized Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Validation Error
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
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     SavedQuestionsResponse:
 *       type: object
 *       properties:
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               saved_id:
 *                 type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   avatar:
 *                     type: string
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tag:
 *                       type: string
 *               title:
 *                 type: string
 *               question:
 *                 type: string
 *               imagesrc:
 *                 type: array
 *                 items:
 *                   type: string
 *               createdat:
 *                 type: string
 *                 format: date-time
 *               updatedat:
 *                 type: string
 *                 format: date-time
 *               answer_count:
 *                 type: string
 *               vote_count:
 *                 type: string
 *               vote:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
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
 */

/**
 * @openapi
 * /api/forums/report/question/{id}:
 *   post:
 *     summary: Report a question
 *     tags:
 *       - Forums
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the question to report
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ReportQuestionRequestBody"
 *     responses:
 *       "200":
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "401":
 *         description: Unauthorized Error
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
 *     ReportQuestionRequestBody:
 *       type: object
 *       properties:
 *         reason:
 *           type: string
 */
