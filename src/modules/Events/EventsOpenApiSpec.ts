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
 *       "201":
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

/**
 * @openapi
 * /api/events/create/partnership/{id}:
 *   post:
 *     summary: Create a partnership for an event
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
 *             $ref: "#/components/schemas/NewEventPartnership"
 *     responses:
 *       "201":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewEventPartnershipResponse"
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
 *     NewEventPartnership:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         organizer:
 *           type: string
 *         type:
 *           type: string
 *         logo:
 *           type: string
 *           format: binary
 *       required:
 *         - name
 *         - organizer
 *         - type
 *         - logo
 *
 *     NewEventPartnershipResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/EventPartnership"
 *       required:
 *         - message
 *         - data
 *
 *     EventPartnership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         event_id:
 *           type: string
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *         organizer:
 *           type: boolean
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
 *         - event_id
 *         - name
 *         - organizer
 *         - type
 *         - createdat
 *         - updatedat
 */

/**
 * @openapi
 * /api/events/update/partnership/{id}:
 *   put:
 *     summary: Update partnership details of an event
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               organizer:
 *                 type: string
 *               type:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateEventPartnershipResponse"
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
 *     UpdateEventPartnershipResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/EventPartnership"
 *       required:
 *         - message
 *         - data
 */

/**
 * @openapi
 * /api/events/delete/partnership/{id}:
 *   delete:
 *     summary: Delete partnership details of an event
 *     tags:
 *       - Events
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
 * /api/events/create/speaker/{id}:
 *   post:
 *     summary: Add a speaker to an event
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
 *             $ref: "#/components/schemas/NewEventSpeaker"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewEventSpeakerResponse"
 */

/**
 *  @openapi
 * components:
 *   schemas:
 *     NewEventSpeaker:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         name:
 *           type: string
 *         profile:
 *           type: string
 *           format: binary
 *
 *     NewEventSpeakerResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/EventSpeaker"
 *       required:
 *         - message
 *         - data
 *
 *     EventSpeaker:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         event_id:
 *           type: string
 *         profile:
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
 *         - event_id
 *         - profile
 *         - name
 *         - title
 *         - createdat
 *         - updatedat
 */

/**
 * @openapi
 * /api/events/update/speaker/{id}:
 *   put:
 *     summary: Update a speaker of an event
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
 *             $ref: "#/components/schemas/UpdateEventSpeaker"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EventSpeakerResponse"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateEventSpeaker:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         title:
 *           type: string
 *         profile:
 *           type: string
 *           format: binary
 *
 *     EventSpeakerResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/EventSpeaker"
 *       required:
 *         - message
 *         - data
 */

/**
 * @openapi
 * /api/events/remove/speaker/{id}:
 *   delete:
 *     summary: Remove a speaker from an event
 *     tags:
 *       - Events
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
 * /api/events/create/tags/{id}:
 *   post:
 *     summary: Create tags for an event
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
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateEventTagsRequest"
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateEventTagsResponse"
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
 *     CreateEventTagsRequest:
 *       type: object
 *       properties:
 *         tags:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: string
 *             - type: string
 *     CreateEventTagsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               event_id:
 *                 type: string
 *               tag_id:
 *                 type: string
 *       required:
 *         - message
 */

/**
 * @openapi
 * /api/events/view/{id}:
 *   get:
 *     summary: View details of an event
 *     tags:
 *       - Events
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
 *               $ref: "#/components/schemas/EventDetailsResponse"
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
 *     EventDetailsResponse:
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
 *         partnership:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/EventPartnership"
 *         speaker:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/EventSpeaker"
 *         tags:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/EventTag"
 *       required:
 *         - id
 *         - title
 *         - createdat
 *         - updatedat
 *
 *     EventPartnership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         logo:
 *           type: string
 *         name:
 *           type: string
 *         organizer:
 *           type: boolean
 *         type:
 *           type: string
 *       required:
 *         - id
 *         - logo
 *         - name
 *         - organizer
 *         - type
 *
 *     EventSpeaker:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         profile:
 *           type: string
 *         title:
 *           type: string
 *       required:
 *         - id
 *         - name
 *         - profile
 *         - title
 *
 *     EventTag:
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
