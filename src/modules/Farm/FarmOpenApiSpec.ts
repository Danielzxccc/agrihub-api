// APPLY FARM
/**
 * @openapi
 * /api/farm/apply:
 *   post:
 *     summary: Submit a new farm application
 *     tags:
 *       - Farm
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/NewFarmApplication"
 *     responses:
 *       "201":
 *         description: Success. Farm application submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmApplicationResponse"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * /api/farm/community-farm:
 *   get:
 *     summary: Get a list of community farms
 *     tags:
 *       - Farm
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
 *         description: Number of items per page
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum:
 *            - District 1
 *            - District 2
 *            - District 3
 *            - District 4
 *            - District 5
 *            - District 6
 *         description: Filter criteria
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityFarmsResponse"
 *       "401":
 *         description: Unauthorized
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
 */

// VIEW FARM
/**
 * @openapi
 * /api/farm/community-farm/{id}:
 *   get:
 *     summary: Get details for a community farm
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the community farm
 *     responses:
 *       "200":
 *         description: Success. Returns details for the community farm.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommunityFarmResponse"
 *       "401":
 *         description: Unauthorized
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
 */

/**
 * @openapi
 * /api/farm/community-farm/gallery:
 *   post:
 *     summary: Add a new gallery item for a community farm
 *     tags:
 *       - Farm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/NewCommunityFarmGallery"
 *     responses:
 *       "201":
 *         description: Success. Returns the newly added gallery item.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CropGalleryItem"
 *
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * /api/farm/community-farm/gallery/{id}:
 *   get:
 *     summary: Get gallery items for a specific community farm
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the community farm
 *     responses:
 *       "200":
 *         description: Success. Returns gallery items for the specified community farm.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CropGalleryItem"
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
 *   delete:
 *     summary: Delete a gallery item
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the gallery item to be deleted
 *     responses:
 *       "200":
 *         description: Success. Returns a message indicating the deletion was successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteSuccessMessage"
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

// ACCEPT FARM
/**
 * @openapi
 * /api/farm/applications/accept/{id}:
 *   put:
 *     summary: Accept a farm application
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the farm application to accept
 *     responses:
 *       "200":
 *         description: Success. Returns details for the accepted farm application.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AcceptFarmApplicationResponse"
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

// REJECT FARM
/**
 * @openapi
 * /api/farm/applications/reject/{id}:
 *   put:
 *     summary: Reject a farm application
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the farm application to accept
 *     responses:
 *       "200":
 *         description: Success. Returns details for the rejected farm application.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AcceptFarmApplicationResponse"
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

// CANCEL APPLICATION
/**
 * @openapi
 * /api/farm/applications/cancel/{id}:
 *   delete:
 *     summary: Cancel a farm application
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the farm application to accept
 *     responses:
 *       "200":
 *         description: Success. Returns details for the rejected farm application.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - message
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

// GET FARM APPLICATIONS
/**
 * @openapi
 * /api/farm/applications:
 *   get:
 *     summary: Get a list of farm applications
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search term
 *       - name: page
 *         in: query
 *         schema:
 *           type: string
 *         description: Page number
 *       - name: filter
 *         in: query
 *         schema:
 *           type: string
 *           enum:
 *            - pending
 *            - rejected
 *            - approved
 *         description: Filter term
 *       - name: perpage
 *         in: query
 *         schema:
 *           type: string
 *         description: Records per page
 *     responses:
 *       "200":
 *         description: Success. Returns a list of farm applications.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmApplicationsResponse"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

// VIEW FARM APPLICATION
/**
 * @openapi
 * /api/farm/applications/{id}:
 *   get:
 *     summary: Get details for a farm application
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the farm application
 *     responses:
 *       "200":
 *         description: Success. Returns details for the farm application.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmApplicationData"
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

// CHECK EXISTING APPLICATION
/**
 * @openapi
 * /api/farm/applications/check-existing:
 *   get:
 *     summary: Get details for a farm application
 *     tags:
 *       - Farm
 *     responses:
 *       "200":
 *         description: Success. Returns details for the farm application.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckExistingApplicationResponse"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * /api/farm/community-farm/crops/{id}:
 *   get:
 *     summary: Get crops for a community farm
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the community farm
 *     responses:
 *       "200":
 *         description: Success. Returns crops for the community farm.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CropItem"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

// ADD CROP TO FARM
/**
 * @openapi
 * /api/farm/community-farm/crop/{farm_id}/{crop_id}:
 *   post:
 *     summary: Add a crop to a community farm
 *     tags:
 *       - Farm
 *     parameters:
 *       - name: farm_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the community farm
 *       - name: crop_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the crop
 *     responses:
 *       "201":
 *         description: Success. Returns details for the added crop.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AddFarmCropResponse"
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

// CREATE
/**
 * @openapi
 * /api/farm:
 *   post:
 *     tags:
 *      - Farm
 *     summary: Create a new farm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/NewFarmRequest"
 *     responses:
 *       "200":
 *         description: Farm created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewFarmResponse"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * /api/farm:
 *   get:
 *     tags:
 *      - Farm
 *     summary: List farms
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search query for farms (optional, default is an empty string)
 *       - name: page
 *         in: query
 *         schema:
 *           type: string
 *         description: Page number (optional)
 *       - name: perpage
 *         in: query
 *         schema:
 *           type: string
 *         description: Number of farms per page (optional, default is 20)
 *     responses:
 *       "200":
 *         description: List of farms
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmListResponse"
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
 */

/**
 * @openapi
 * /api/farm/crop/find:
 *   get:
 *     summary: Retrieve a list of crops
 *     tags:
 *       - Farm
 *     responses:
 *       "200":
 *         description: List of crops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CropData"
 */

/**
 * @openapi
 * /api/farm/crop:
 *   post:
 *     summary: Create a new crop
 *     tags:
 *       - Farm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/NewCropRequest"
 *     responses:
 *       "201":
 *         description: Crop created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewCropResponse"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * /crop/report/{farmid}/{userid}:
 *   post:
 *     summary: Create a new crop report
 *     tags:
 *       - Crop
 *     parameters:
 *       - name: farmid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the farm
 *       - name: userid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewCropReportRequest"
 *     responses:
 *       "200":
 *         description: Crop report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewCropReportResponse"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * /api/farm/subfarm/overview:
 *   get:
 *     summary: Get overview details for a subfarm
 *     tags:
 *       - Farm
 *     responses:
 *       "200":
 *         description: Success. Returns overview details for the subfarm.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SubfarmOverviewResponse"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * /api/farm/crop/reports:
 *   get:
 *     summary: Get crop reports for a farm
 *     tags:
 *       - Farm
 *     responses:
 *       "200":
 *         description: Success. Returns a list of crop reports for the farm.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CropReport"
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
 *       "500":
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */

/**
 * @openapi
 * /api/farm/farmer/invitation:
 *   post:
 *     tags:
 *       - Farm
 *     summary: Send a farmer invitation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NewFarmerInvitationRequest"
 *     responses:
 *       "200":
 *         description: Successful invitation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FarmerInvitationResponse"
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
