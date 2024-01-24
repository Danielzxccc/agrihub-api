import express from 'express'
import * as FarmController from './FarmController'
import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
export const FarmRouter = express.Router()

// apply farms

FarmRouter.post(
  '/apply',
  UserGuard(['member', 'admin']),
  upload.fields([
    { name: 'selfie', maxCount: 1 },
    { name: 'proof', maxCount: 1 },
    { name: 'valid_id', maxCount: 1 },
    { name: 'farm_actual_images', maxCount: 5 },
  ]),
  FarmController.applyFarm
)

FarmRouter.put(
  '/applications/accept/:id',
  UserGuard(['admin', 'asst_admin']),
  FarmController.acceptFarmApplication
)

FarmRouter.put(
  '/applications/reject/:id',
  UserGuard(['admin', 'asst_admin']),
  FarmController.rejectFarmApplication
)

FarmRouter.delete(
  '/applications/cancel/:id',
  UserGuard(['member']),
  FarmController.cancelExistingApplication
)

FarmRouter.get(
  '/applications/check-existing',
  UserGuard(['member', 'admin']),
  FarmController.checkExistingApplication
)

// list farm applications
FarmRouter.get(
  '/applications',
  UserGuard(['admin', 'asst_admin']),
  FarmController.listFarmApplications
)

FarmRouter.get(
  '/applications/:id',
  UserGuard(['admin', 'asst_admin']),
  FarmController.viewFarmApplication
)

FarmRouter.get('/community-farm/:id', FarmController.viewCommunityFarm)

FarmRouter.get(
  '/community-farm/crops/:id',
  FarmController.listCommunityFarmCrops
)

FarmRouter.post(
  '/community-farm/crop/:farm_id/:crop_id',
  UserGuard(['farm_head']),
  FarmController.registerCropInFarmCommunity
)

FarmRouter.post(
  '/community-farm/gallery',
  UserGuard(['farm_head']),
  upload.array('image'),
  FarmController.createCommunityGallery
)

FarmRouter.get(
  '/community-farm/gallery/:id',
  FarmController.listCommunityFarmGallery
)

/**
 * @deprecated
 */

FarmRouter.get('/', FarmController.listFarms)
FarmRouter.get('/:id', FarmController.viewFarm)
// TOD: ADD USER AUTHORIZATION LATER
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

FarmRouter.post('/crop', upload.single('image'), FarmController.createCrop)

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
