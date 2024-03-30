/**
 * @openapi
 * /api/forums:
 *   get:
 *     tags:
 *       - Forums
 *     summary: Get Questions Data
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
 *       - in: query
 *         name: profile
 *         schema:
 *           type: string
 *         description: profile query
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: tag query
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuestionsResponse"
 *       "400":
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
 *   post:
 *     tags:
 *       - Forums
 *     summary: Create Questions
 *     description: Create new questions in the forum
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/QuestionSchema"
 *     responses:
 *       "201":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewQuestionSchema"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
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
 * /api/forums/{id}:
 *   get:
 *     tags:
 *       - "Forums"
 *     summary: Get Question Details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *            - newest
 *            - top
 *         description: Filter criteria (optional, default newest)
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuestionViewSchema"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
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
 *   put:
 *     tags:
 *       - "Forums"
 *     summary: Update Question Details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/UpdateQuestionSchema"
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
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
 * /api/forums/vote/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *   post:
 *     tags:
 *       - "Forums"
 *     summary: Upvote or Downvote Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum:
 *                  - upvote
 *                  - downvote
 *             required:
 *               - type
 *     responses:
 *       "201":
 *         description: Successful vote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VoteResponseSchema"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "401":
 *         description: Unauthorized
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
 * /api/forums/vote/delete/{id}:
 *   delete:
 *     summary: Delete a vote for a forum
 *     tags:
 *       - Forums
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vote for a forum
 *     responses:
 *       "200":
 *         description: Success. Indicates that the vote for the forum has been deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteVoteForumResponse"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Not Found
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
 * /api/forums/create/answers/{id}:
 *   post:
 *     summary: Create a new answer in the forum
 *     tags:
 *       - Forums
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AnswersSchema"
 *     responses:
 *       "201":
 *         description: Answer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewAnswerResponse"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
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
 * /api/forums/create/comments/{answerId}:
 *   post:
 *     summary: Create a comment for an answer in the forum
 *     tags:
 *       - Forums
 *     parameters:
 *       - name: answerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CommentsSchema"
 *     responses:
 *       "200":
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewCommentResponse"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
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
 * /api/forums/vote/answer/{id}:
 *   post:
 *     summary: Vote for an answer in the forum
 *     tags:
 *       - Forums
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VoteAnswerSchema"
 *     responses:
 *       "201":
 *         description: Voted Answer Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VoteAnswerSuccessResponse"
 *       "400":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
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
 * /api/forums/delete/vote-answer/{id}:
 *   delete:
 *     summary: Delete a vote for an answer
 *     tags:
 *       - Forums
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vote for an answer
 *     responses:
 *       "200":
 *         description: Success. Indicates that the vote for the answer has been deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteVoteAnswerResponse"
 *       "401":
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "429":
 *         description: Too much request
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

/**
 * @openapi
 * /api/forums/delete/answer/{id}:
 *   delete:
 *     summary: Delete an answer
 *     tags:
 *       - Forums
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the answer to be deleted
 *         required: true
 *     responses:
 *       "200":
 *         description: Answer Deleted Successfully
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
 * /api/forums/delete/comment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Forums
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the comment to be deleted
 *         required: true
 *     responses:
 *       "200":
 *         description: Comment Deleted successfully
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
 * /api/forums/update/answer/{id}:
 *   put:
 *     summary: Update Forum Answer
 *     tags:
 *       - Forums
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the forum answer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answer:
 *                 type: string
 *                 minLength: 1
 *                 description: The updated answer content
 *             required:
 *               - answer
 *     responses:
 *       "200":
 *         description: Successful response
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
 * /api/forums/update/comment/{id}:
 *   put:
 *     summary: Update Forum Comment
 *     tags:
 *       - Forums
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the forum comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 minLength: 1
 *                 description: The updated comment content
 *             required:
 *               - comment
 *     responses:
 *       "200":
 *         description: Successful response
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
