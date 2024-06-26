import express from 'express'
import * as FarmController from './FarmController'
import upload from '../../config/multer'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
export const FarmRouter = express.Router()

// apply farms

FarmRouter.post(
  '/apply',
  UserGuard(['member', 'admin']),
  upload.fields([
    // { name: 'selfie', maxCount: 1 },
    { name: 'proof', maxCount: 1 },
    { name: 'valid_id', maxCount: 1 },
    { name: 'farm_actual_images', maxCount: 5 },
  ]),
  FarmController.applyFarm
)

FarmRouter.get('/community-farm', FarmController.listCommunityFarms)

FarmRouter.get(
  '/community-farm/archived',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmController.listArchivedCommunityFarms
)

FarmRouter.delete(
  '/community-farm/archived/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmController.archiveCommunityFarm
)

FarmRouter.put(
  '/community-farm/restore/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmController.restoreCommunityFarm
)

FarmRouter.put(
  '/applications/accept/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmController.acceptFarmApplication
)

FarmRouter.put(
  '/applications/reject/:id',
  AccessGuard('farms'),
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
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmController.listFarmApplications
)

FarmRouter.get(
  '/applications/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  FarmController.viewFarmApplication
)

FarmRouter.get('/community-farm/:id', FarmController.viewCommunityFarm)

FarmRouter.put(
  '/community-farm/update',
  UserGuard(['farm_head']),
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 },
  ]),
  FarmController.updateCommunityFarm
)

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

FarmRouter.delete(
  '/community-farm/gallery/:id',
  UserGuard(['farm_head']),
  FarmController.removeCommunityFarmImage
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

FarmRouter.get(
  '/crop/find/other',
  UserGuard(['admin', 'asst_admin']),
  FarmController.listOtherCrops
)

FarmRouter.get(
  '/crop/find/archived',
  UserGuard(['admin', 'asst_admin']),
  FarmController.listArchivedCrops
)

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

FarmRouter.post(
  '/farmer/invitation',
  UserGuard(['farm_head']),
  FarmController.createFarmerInvitation
)

FarmRouter.post(
  '/farmer/invitation/accept/:id',
  UserGuard(['member']),
  FarmController.acceptFarmerApplication
)

FarmRouter.delete(
  '/farmer/invitation/reject/:id',
  UserGuard(['member']),
  FarmController.rejectFarmerApplication
)

FarmRouter.delete(
  '/farmer/invitation/cancel/:id',
  UserGuard(['farm_head']),
  FarmController.cancelFarmerInvitation
)

FarmRouter.get(
  '/farmer/invitation/view/:id',
  UserGuard(['member']),
  FarmController.viewFarmerInvitation
)

FarmRouter.get(
  '/farmer/invitation/list',
  UserGuard(['farm_head']),
  FarmController.listFarmerInvitations
)

FarmRouter.get(
  '/farmer/members/:id',
  UserGuard(['admin', 'asst_admin', 'farm_head', 'farmer']),
  FarmController.listCommunityFarmMembers
)

FarmRouter.delete(
  '/community-farm/crop/archive/:id',
  UserGuard(['farm_head']),
  FarmController.archiveCommunityCrop
)

FarmRouter.put(
  '/community-farm/crop/unarchive/:id',
  UserGuard(['farm_head']),
  FarmController.unArchiveCommunityCrop
)

FarmRouter.get(
  '/community-farm/crop/archived/list',
  UserGuard(['farm_head']),
  FarmController.listArchivedCommunityCrops
)

FarmRouter.put(
  '/crop/update/:id',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  upload.single('image'),
  FarmController.updateCrop
)

FarmRouter.get('/crop/view/:id', FarmController.viewCropDetails)

FarmRouter.post(
  '/community/leave',
  UserGuard(['farmer']),
  FarmController.leaveCommunityFarm
)

FarmRouter.post(
  '/community/kick/:id',
  UserGuard(['farm_head']),
  FarmController.kickCommunityFarmMember
)

FarmRouter.post(
  '/community/assign/head/:id',
  UserGuard(['farm_head']),
  FarmController.setFarmerAsFarmHead
)

FarmRouter.post(
  '/community/unassign/head/:id',
  UserGuard(['farm_head']),
  FarmController.setFarmerHeadAsFarmer
)

FarmRouter.delete(
  '/crop/archive/:id',
  UserGuard(['admin', 'asst_admin']),
  FarmController.archiveCrop
)

FarmRouter.put(
  '/crop/unarchive/:id',
  UserGuard(['admin', 'asst_admin']),
  FarmController.unarchiveCrop
)
