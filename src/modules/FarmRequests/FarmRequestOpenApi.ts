/**
 * @openapi
 * /api/request/seedling:
 *   post:
 *     summary: Create a new seedling request
 *     tags:
 *       - FarmRequest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewSeedlingRequest"
 *     responses:
 *       "201":
 *         description: Seedling request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewSeedlingResponse"
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
 *     NewSeedlingRequest:
 *       type: object
 *       properties:
 *         crop_id:
 *           type: string
 *         other:
 *           type: string
 *         quantity_request:
 *           type: number
 *         note:
 *           type: string
 *     NewSeedlingResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: "#/components/schemas/SeedlingRequest"
 *     SeedlingRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         crop_id:
 *           type: string
 *         other:
 *           type: string
 *         farm_id:
 *           type: string
 *         quantity_request:
 *           type: string
 *         quantity_approve:
 *           type: string
 *         status:
 *           type: string
 *         delivery_date:
 *           type: string
 *         note:
 *           type: string
 */

/**
 * @openapi
 * /api/request/seedling/cancel/{id}:
 *   delete:
 *     summary: Cancel a seedling request
 *     tags:
 *       - FarmRequest
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the seedling request to be deleted
 *         required: true
 *     responses:
 *       "200":
 *         description: Request cancelled successfully
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
 * /api/request/seedling/list/{id}:
 *   get:
 *     summary: Retrieve a list of seedling requests by community farm
 *     tags:
 *       - FarmRequest
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the community farm
 *         required: true
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, ""]
 *         description: Filter by request status
 *     responses:
 *       "200":
 *         description: A list of all seedling requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SeedlingRequestListAllResponse"
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
 *     SeedlingRequestListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         crop_id:
 *           type: string
 *         farm_id:
 *           type: string
 *         other:
 *           type: string
 *         quantity_request:
 *           type: string
 *         quantity_approve:
 *           type: string
 *         status:
 *           type: string
 *         delivery_date:
 *           type: string
 *         note:
 *           type: string
 *         name:
 *           type: string
 *         farm_name:
 *           type: string
 */

/**
 * @openapi
 * /api/request/seedling/list/all:
 *   get:
 *     summary: Retrieve a list of all seedling requests
 *     tags:
 *       - FarmRequest
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, ""]
 *         description: Filter by request status
 *     responses:
 *       "200":
 *         description: A list of all seedling requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SeedlingRequestListAllResponse"
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
 *     SeedlingRequestListAllResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/SeedlingRequestListItem"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 */

/**
 * @openapi
 * /api/request/seedling/accept/{id}:
 *   put:
 *     summary: Accept a seedling request
 *     tags:
 *       - FarmRequest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the seedling request to accept
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AcceptSeedlingRequest"
 *     responses:
 *       "200":
 *         description: Seedling request accepted successfully
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
 *     AcceptSeedlingRequest:
 *       type: object
 *       properties:
 *         quantity_approve:
 *           type: number
 *         delivery_date:
 *           type: string
 *         note:
 *           type: string
 */

/**
 * @openapi
 * /api/request/seedling/reject/{id}:
 *   delete:
 *     summary: Reject a seedling request
 *     tags:
 *       - FarmRequest
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The ID of the seedling request to be deleted
 *         required: true
 *     responses:
 *       "200":
 *         description: Request cancelled successfully
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
 * /api/request/count:
 *   get:
 *     summary: Get count of pending and accepted requests
 *     tags:
 *       - FarmRequest
 *     responses:
 *       "200":
 *         description: Count of pending and accepted requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RequestCount"
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
 *     RequestCount:
 *       type: object
 *       properties:
 *         pending_requests:
 *           type: string
 *         accepted_requests:
 *           type: string
 */

/**
 * @openapi
 * /api/request/tool-request:
 *   post:
 *     summary: Submit Tool Request
 *     tags:
 *       - FarmRequest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewToolRequest"
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
 *     NewToolRequest:
 *       type: object
 *       properties:
 *         tool_requested:
 *           type: string
 *         quantity_requested:
 *           type: string
 *         requester_note:
 *           type: string
 *         contact:
 *           type: string
 *       required:
 *         - tool_requested
 *         - quantity_requested
 *         - requester_note
 *         - contact
 */

/**
 * @openapi
 * /api/request/tool-request:
 *   get:
 *     summary: List Tool Requests
 *     tags:
 *       - FarmRequest
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number
 *       - in: query
 *         name: perpage
 *         schema:
 *           type: string
 *         description: Items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - accepted
 *             - communicating
 *             - rejected
 *             - forwarded
 *             - completed
 *         description: Filter by status
 *       - in: query
 *         name: farmid
 *         schema:
 *           type: string
 *         description: Filter by farm ID
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListToolRequestResponse"
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
 *     ToolRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tool_requested:
 *           type: string
 *         quantity_requested:
 *           type: string
 *         status:
 *           type: string
 *         requester_note:
 *           type: string
 *         client_note:
 *           type: string
 *         forwarded_to:
 *           type: string
 *         accepted_by:
 *           type: array
 *           items:
 *             type: string
 *         contact:
 *           type: string
 *         farm_id:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         farm_name:
 *           type: string
 *         location:
 *           type: string
 *         description:
 *           type: string
 *         farm_head:
 *           type: string
 *         district:
 *           type: string
 *         size:
 *           type: string
 *         avatar:
 *           type: string
 *         cover_photo:
 *           type: string
 *         application_id:
 *           type: string
 *         is_archived:
 *           type: boolean
 *     ListToolRequestResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ToolRequest"
 *         pagination:
 *           $ref: "#/components/schemas/PaginationData"
 */

/**
 * @openapi
 * /api/request/tool-request/update/{id}:
 *   post:
 *     summary: Update Tool Request Status
 *     tags:
 *       - FarmRequest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tool request to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateToolRequestStatus"
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
 *     UpdateToolRequestStatus:
 *       type: object
 *       properties:
 *         client_note:
 *           type: string
 *         accepted_by:
 *           type: array
 *           items:
 *             type: string
 *         forwarded_to:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - accepted
 *             - communicating
 *             - rejected
 *             - completed
 *             - forwarded
 *       required:
 *         - status
 */
