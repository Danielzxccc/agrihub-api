import express from 'express'
import * as FarmController from './FarmController'
import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
export const FarmRouter = express.Router()

FarmRouter.get('/', FarmController.listFarms)
FarmRouter.get('/:id', FarmController.viewFarm)
// TODO: ADD USER AUTHORIZATION LATER
FarmRouter.post('/', upload.single('avatar'), FarmController.registerFarm)
// create subfarm
FarmRouter.post(
  '/subfarm/:farmid/:head',
  UserGuard(['subfarm_head']),
  FarmController.registerSubFarm
)

FarmRouter.get(
  '/subfarm/overview',
  UserGuard(['subfarm_head', 'farmer']),
  FarmController.viewSubFarm
)

// crops
FarmRouter.get('/crop/find', FarmController.listCrops)

FarmRouter.post(
  '/crop',
  UserGuard(['user']),
  upload.single('image'),
  FarmController.createCrop
)

FarmRouter.post(
  '/crop/report/:farmid/:userid',
  UserGuard(['subfarm_head']),
  upload.single('image'),
  FarmController.createCropReport
)

FarmRouter.get(
  '/crop/reports',
  UserGuard(['subfarm_head', 'farm_head']),
  FarmController.listActiveCropReports
)

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
 *       "200":
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
