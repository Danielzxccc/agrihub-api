/**
 * @openapi
 * /api/events/create/draft:
 *   post:
 *     summary: Create a draft event
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewDraftEvent"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateDraftEventResponse"
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
 *     NewDraftEvent:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *       required:
 *         - title
 *
 *     CreateDraftEventResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/Event"
 *       required:
 *         - message
 *         - data
 *
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         banner:
 *           type: string
 *         event_start:
 *           type: string
 *           format: date-time
 *         event_end:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         title:
 *           type: string
 *         about:
 *           type: string
 *         is_archived:
 *           type: boolean
 *         status:
 *           type: string
 *         type:
 *           type: string
 *         guide:
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
 *       required:
 *         - id
 *         - title
 *         - createdat
 *         - updatedat
 */

/**
 * @openapi
 * /api/events/update/draft/{id}:
 *   put:
 *     summary: Update a draft event
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/UpdateDraftEvent"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateDraftEventResponse"
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
 *     UpdateDraftEvent:
 *       type: object
 *       properties:
 *         event_start:
 *           type: string
 *         event_end:
 *           type: string
 *         location:
 *           type: string
 *         title:
 *           type: string
 *         about:
 *           type: string
 *         type:
 *           type: string
 *         guide:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 *       required:
 *         - title
 *
 *     UpdateDraftEventResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/Event"
 *       required:
 *         - message
 *         - data
 *
 */
