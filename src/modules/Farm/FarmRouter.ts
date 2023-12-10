import express from 'express'
import * as FarmController from './FarmController'
import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
export const FarmRouter = express.Router()

FarmRouter.get('/', FarmController.listFarms)
FarmRouter.get('/:id', FarmController.viewFarm)
// TODO: ADD USER AUTHORIZATION LATER
FarmRouter.post('/', upload.single('avatar'), FarmController.registerFarm)
// subfarm
FarmRouter.post('/:farmid/:head', FarmController.registerSubFarm)

// crops
FarmRouter.post(
  '/crop',
  UserGuard(['user']),
  upload.single('image'),
  FarmController.createCrop
)

FarmRouter.post(
  '/crop/report/:farmid/:userid',
  UserGuard(['user']),
  upload.single('image'),
  FarmController.createCropReport
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
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/FarmListResponse"
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
