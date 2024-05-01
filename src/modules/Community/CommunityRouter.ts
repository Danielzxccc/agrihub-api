import upload from '../../config/multer'
import { UserGuard } from '../AuthGuard/UserGuard'
import * as CommunityController from './CommunityController'
import express from 'express'

export const CommunityRouter = express.Router()

CommunityRouter.post(
  '/questions',
  UserGuard(['farm_head']),
  CommunityController.createNewFarmQuestion
)

CommunityRouter.get('/questions/:id', CommunityController.findFarmQuestions)
CommunityRouter.delete('/questions/:id', CommunityController.deleteFarmQuestion)

CommunityRouter.post(
  '/member/application/:id',
  UserGuard(['member']),
  upload.fields([
    { name: 'proof_selfie', maxCount: 1 },
    { name: 'valid_id', maxCount: 1 },
  ]),
  CommunityController.joinCommunityFarm
)

CommunityRouter.get(
  '/member/applications/:id',
  UserGuard(['farm_head']),
  CommunityController.listFarmerApplications
)

CommunityRouter.get(
  '/member/application/view/:id',
  UserGuard(['farm_head']),
  CommunityController.findFarmerApplication
)

CommunityRouter.put(
  '/member/application/update/:id',
  UserGuard(['farm_head']),
  CommunityController.updateApplicationStatus
)

CommunityRouter.delete(
  '/member/application/cancel/:id',
  UserGuard(['member']),
  CommunityController.cancelFarmerApplication
)

CommunityRouter.get(
  '/member/application/existing',
  UserGuard(['member']),
  CommunityController.checkExistingFarmerApplication
)

CommunityRouter.post(
  '/crop/report/planted/:id',
  UserGuard(['farm_head', 'farmer']),
  upload.array('images'),
  CommunityController.createPlantedReport
)

CommunityRouter.post(
  '/crop/report/harvested/:id',
  UserGuard(['farm_head', 'farmer']),
  upload.array('images'),
  CommunityController.createHarvestedReport
)

CommunityRouter.get(
  '/crop/reports/:id',
  UserGuard(['farm_head', 'farmer', 'admin', 'asst_admin']),
  CommunityController.listPlantedCropReports
)

CommunityRouter.post(
  '/task/planted/:id',
  UserGuard(['farm_head']),
  CommunityController.createPlantedCommunityTask
)

CommunityRouter.post(
  '/task/harvest/:id',
  UserGuard(['farm_head']),
  CommunityController.createHarvestTask
)

CommunityRouter.get(
  '/task/list/:id',
  UserGuard(['farm_head', 'farmer']),
  CommunityController.listCommunityTasks
)

CommunityRouter.get(
  '/task/list/farmer/:id',
  UserGuard(['farm_head', 'farmer']),
  CommunityController.listCommunityTasksByFarmer
)

CommunityRouter.delete(
  '/task/delete/:id',
  UserGuard(['farm_head', 'farmer']),
  CommunityController.deleteCommunityTask
)

CommunityRouter.post(
  '/event/create',
  UserGuard(['farm_head']),
  upload.single('banner'),
  CommunityController.createCommunityEvent
)

CommunityRouter.put(
  '/event/update/:id',
  UserGuard(['farm_head']),
  upload.single('banner'),
  CommunityController.updateCommunityEvent
)

CommunityRouter.get(
  '/event/list/:id',
  UserGuard(['farm_head', 'farmer', 'admin', 'member', 'asst_admin']),
  CommunityController.listCommunityEvents
)

CommunityRouter.get('/event/list', CommunityController.listCommunityEvents)

CommunityRouter.delete(
  '/event/delete/:id',
  UserGuard(['farm_head']),
  CommunityController.deleteCommunityEvent
)

CommunityRouter.get('/event/view/:id', CommunityController.viewCommunityEvent)

CommunityRouter.post('/event/action/:id', CommunityController.eventAction)

CommunityRouter.delete(
  '/remove/existing/report/:id',
  UserGuard(['farm_head']),
  CommunityController.removeExistingCropReport
)
