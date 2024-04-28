import upload from '../../config/multer'
import { AccessGuard, UserGuard } from '../AuthGuard/UserGuard'
import * as ReportsController from './ReportsController'
import express from 'express'

export const ReportsRouter = express.Router()

ReportsRouter.post(
  '/crop',
  UserGuard(['farm_head']),
  upload.array('image'),
  ReportsController.createCommunityCropReport
)

ReportsRouter.get(
  '/farmer/graph/stacked-bar',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.listWitheredHarvestedCrops
)

ReportsRouter.get(
  '/farmer/graph/piechart',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.listTotalPlantedCrops
)

ReportsRouter.get(
  '/farmer/graph/total-harvest',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.listTotalHarvestEachMonth
)

ReportsRouter.get(
  '/farmer/graph/growth-harvest',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.listGrowthHarvestStats
)

ReportsRouter.get(
  '/farmer/total-harvested',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.listTotalHarvestedCrops
)

ReportsRouter.get(
  '/crop/statistics/:name',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.viewCropStatistics
)

ReportsRouter.get(
  '/crop/report/summary',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.leastPerformantCrops
)

ReportsRouter.get(
  '/crop/report/:id',
  UserGuard(['farm_head', 'admin', 'asst_admin']),
  ReportsController.listCommuntityCropReports
)

ReportsRouter.get(
  '/crop/report/existing/:id',
  UserGuard(['farm_head', 'admin', 'asst_admin']),
  ReportsController.listExistingCropReports
)

ReportsRouter.get(
  '/crop/report/view/:id',
  UserGuard(['farm_head']),
  ReportsController.viewCommunityCropReport
)

ReportsRouter.post(
  '/crop/report/inactive/:id',
  UserGuard(['farm_head']),
  ReportsController.markReportAsInactive
)

ReportsRouter.put(
  '/crop/remove/:id',
  UserGuard(['farm_head']),
  ReportsController.removeCommunityCropReport
)

ReportsRouter.get(
  '/crop/growth-rate',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.getAverageGrowthRate
)

ReportsRouter.get(
  '/learning-materials',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.getSuggestedLearningMaterials
)

ReportsRouter.get(
  '/admin/graph/harvested-withered',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.listAllWitheredHarvestedCrops
)

ReportsRouter.get(
  '/admin/favourite/crops',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.listFavouriteCrops
)

ReportsRouter.get(
  '/admin/lowest/growth-rate',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getLowestGrowthRates
)

ReportsRouter.get(
  '/admin/growth-rate/monthly',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getGrowthRatePerMonth
)

ReportsRouter.get(
  '/admin/resources/count',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.listResourcesCount
)

ReportsRouter.get(
  '/admin/resources/count/detailed',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.listResourcesCountDetails
)

ReportsRouter.get(
  '/admin/farms/district',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.listTotalHarvestPerDistrict
)

ReportsRouter.get(
  '/farms/overview',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getFarmOverview
)

ReportsRouter.get(
  '/forums/overview',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getForumOverview
)

ReportsRouter.get(
  '/forums/count',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getForumsCount
)

ReportsRouter.get(
  '/common/overview',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getCommonListOverview
)

ReportsRouter.get(
  '/analytics/overview/piechart',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getAnalyticsOverviewPieChart
)

ReportsRouter.get(
  '/analytics/overview/user-feedback',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getUserFeedbackOverview
)

ReportsRouter.get(
  '/analytics/harvest/distribution',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getFarmHarvestDistribution
)

ReportsRouter.get(
  '/analytics/crop/distribution',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getCropHarvestDistribution
)

ReportsRouter.get(
  '/analytics/crop/distribution/community',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.getCropHarvestDistributionPerFarm
)

ReportsRouter.get(
  '/analytics/growth-rate/distribution',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getGrowthRateDistribution
)

ReportsRouter.get(
  '/farm/inactive',
  AccessGuard('farms'),
  UserGuard(['admin', 'asst_admin']),
  ReportsController.listInactiveFarms
)

ReportsRouter.get(
  '/farm/land-size/analytics',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getLandSizeAnalytics
)

ReportsRouter.get(
  '/farm/land-size/analytics/district',
  UserGuard(['admin', 'asst_admin']),
  ReportsController.getLandSizeAnalyticsPerDistrict
)

ReportsRouter.get(
  '/analytics/pre-defined',
  UserGuard(['farm_head', 'farmer']),
  ReportsController.getPreDefinedMessages
)
