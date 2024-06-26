/**
 * @openapi
 * /api/access/create/admin:
 *   post:
 *     summary: Create a new admin
 *     tags:
 *       - Access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewAdminRequestBody"
 *     responses:
 *       "201":
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/NewAdminResponseData"
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
 *     NewAdminRequestBody:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         access:
 *           type: object
 *           properties:
 *             farms:
 *               type: boolean
 *             learning:
 *               type: boolean
 *             event:
 *               type: boolean
 *             blog:
 *               type: boolean
 *             forums:
 *               type: boolean
 *             admin:
 *               type: boolean
 *             cuai:
 *               type: boolean
 *             home:
 *               type: boolean
 *             about:
 *               type: boolean
 *             users:
 *               type: boolean
 *             privacy_policy:
 *               type: boolean
 *             terms_and_conditions:
 *               type: boolean
 *             user_feedback:
 *               type: boolean
 *             crops:
 *               type: boolean
 *             help_center:
 *               type: boolean
 *             activity_logs:
 *               type: boolean
 *     NewAdminResponseData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 */

/**
 * @openapi
 * /api/access/update/access/{id}:
 *   put:
 *     summary: Update access control for a user
 *     tags:
 *       - Access
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateAccessControl"
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
 *     UpdateAccessControl:
 *       type: object
 *       properties:
 *         farms:
 *           type: boolean
 *         learning:
 *           type: boolean
 *         event:
 *           type: boolean
 *         blog:
 *           type: boolean
 *         forums:
 *           type: boolean
 *         admin:
 *           type: boolean
 *         cuai:
 *           type: boolean
 *         home:
 *           type: boolean
 *         about:
 *           type: boolean
 *         users:
 *           type: boolean
 *         privacy_policy:
 *           type: boolean
 *         terms_and_conditions:
 *           type: boolean
 *         user_feedback:
 *           type: boolean
 *         crops:
 *           type: boolean
 *         help_center:
 *           type: boolean
 *         activity_logs:
 *           type: boolean
 */

/**
 * @openapi
 * /api/access/view/access/{id}:
 *   get:
 *     summary: View access control for a user
 *     tags:
 *       - Access
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: User access control details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserSchema"
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
