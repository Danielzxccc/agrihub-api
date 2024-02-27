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
 * /api/request/seedling/list:
 *   get:
 *     summary: Retrieve a list of seedling requests by community farm
 *     tags:
 *       - FarmRequest
 *     responses:
 *       "200":
 *         description: A list of seedling requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/SeedlingRequestListItem"
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
