/**
 * @openapi
 * /api/cms/client-details:
 *   get:
 *     summary: Retrieve client details from the CMS
 *     tags:
 *       - CMS
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientDetailsResponse"
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
 *     ClientDetailsResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *         email:
 *           type: string
 *         contact_number:
 *           type: string
 *         address:
 *           type: string
 *         mission:
 *           type: string
 *         vision:
 *           type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         socials:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Social"
 *         partners:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Partner"
 *         members:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Member"
 *     Social:
 *       type: object
 *       properties:
 *         createdat:
 *           type: string
 *           format: date-time
 *         id:
 *           type: string
 *         link:
 *           type: string
 *         name:
 *           type: string
 *         updatedat:
 *           type: string
 *           format: date-time
 *     Partner:
 *       type: object
 *       properties:
 *         createdat:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         id:
 *           type: string
 *         logo:
 *           type: string
 *         name:
 *           type: string
 *         updatedat:
 *           type: string
 *           format: date-time
 *     Member:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *         id:
 *           type: string
 *         image:
 *           type: string
 *         name:
 *           type: string
 *         position:
 *           type: string
 */
