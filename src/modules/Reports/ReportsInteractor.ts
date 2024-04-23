import HttpError from '../../utils/HttpError'
import { NewCommunityFarmReport } from '../../types/DBTypes'
import {
  createCrop,
  findCommunityFarmById,
  findCrop,
  insertCommunityFarmCrop,
} from '../Farm/FarmService'
import * as Service from './ReportsService'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile } from '../../utils/file'
import { findUser } from '../Users/UserService'
import { uploadFiles } from '../AWS-Bucket/UploadService'
import log, { getMonthByIndex } from '../../utils/utils'
import axios from 'axios'
import { findLearningMaterialByTags } from '../LearningMaterials/LearningService'
import {
  DistrictType,
  NewCommunityCropReportT,
} from '../../schema/ReportsSchema'

export async function createCommunityCropReport(
  userid: string,
  reportRequest: NewCommunityCropReportT,
  images: Express.Multer.File[]
) {
  try {
    const report = reportRequest.body

    const user = await findUser(userid)
    if (!userid) throw new HttpError('Unathorized', 401)

    const farm = await findCommunityFarmById(user.farm_id)

    if (!farm) throw new HttpError("Can't find farm", 404)
    if (userid !== farm.farm_head) throw new HttpError('Unathorized', 401)

    // id of crops that are available in admin
    let cropIdToFind
    if (report.crop_id) {
      const crop = await Service.findCommunityFarmCrop(report.crop_id as string)
      if (!crop) throw new HttpError("Can't find crop", 404)
      cropIdToFind = crop.crop_id
    }

    const [parent] = await findCrop(cropIdToFind)

    let parentCrop = parent

    if (report.is_other) {
      try {
        var newCropObject = await createCrop({
          name: report.c_name,
          is_other: true,
          description: '',
          isyield: report.isyield,
          planting_season: null,
          growth_span: null,
          harvest_season: null,
          seedling_season: null,
        })
      } catch (error) {
        throw new HttpError(
          'Crop is available on options or Add a unique name for your crop. ex: (farm_name + name of the crop)',
          400
        )
      }

      const newCommunityCrop = await insertCommunityFarmCrop({
        farm_id: user.farm_id,
        crop_id: newCropObject.id,
      })

      parentCrop = newCropObject

      report.crop_id = newCommunityCrop.id
    }

    delete report.is_other
    delete report.c_name
    delete report.isyield

    const newReport = await Service.insertCommunityCropReport({
      ...report,
      farmid: user.farm_id,
      userid,
    })

    if (images.length) {
      const reportImages = images.map((item) => {
        return {
          imagesrc: item.filename,
          report_id: newReport.id,
          crop_name: parentCrop.name,
        }
      })
      await Service.insertCropReportImage(reportImages)
      await uploadFiles(images)

      for (const image of images) {
        deleteFile(image.filename)
      }
    }

    return newReport
  } catch (error) {
    for (const image of images) {
      deleteFile(image.filename)
    }

    dbErrorHandler(error)
  }
}

export async function listWitheredHarvestedCrops(
  userid: string,
  month?: number
) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const farm = await findCommunityFarmById(user.farm_id)
  if (!farm) throw new HttpError("Can't find farm", 404)

  const data = await Service.getHarvestedAndWitheredCrops(farm.id, month)
  return data
}

export async function listAllWitheredHarvestedCrops(
  year = new Date().getFullYear(),
  start = 1,
  end = 12
) {
  const rawData = await Service.getTotalWitheredHarvestEachMonth(
    year,
    start,
    end
  )

  const data = rawData.rows[0]

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  if ((start !== 1 && end !== 12) || start === 1 || end === 12) {
    const startIndex = start - 1
    const endIndex = end - 1

    months.splice(endIndex + 1)

    if (startIndex > 0) {
      months.splice(0, startIndex)
    }
  }

  const dataKeys = Object.keys(data ?? {})

  const transformedData = months.map((month) => {
    const harvestedIndex = dataKeys.findIndex((e) => e === month.toLowerCase())
    const witheredIndex = dataKeys.findIndex(
      (e) => e === month.toLowerCase() + '_w'
    )

    return {
      month: month,
      harvested: Number(Object.values(data ?? {})[harvestedIndex]),
      withered: Number(Object.values(data ?? {})[witheredIndex]),
    }
  })

  return transformedData
}

export async function listTotalHarvestedCrops(userid: string) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const farm = await findCommunityFarmById(user.farm_id)
  if (!farm) throw new HttpError("Can't find farm", 404)

  const data = await Service.getTotalHarvestedCrops(farm.id)
  return data
}

export async function listTotalPlantedCrops(userid: string) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const farm = await findCommunityFarmById(user.farm_id)
  if (!farm) throw new HttpError("Can't find farm", 404)

  const data = await Service.getTotalPlantedQuantity(farm.id)
  return data
}

export async function listTotalHarvestEachMonth(userid: string) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const farm = await findCommunityFarmById(user.farm_id)
  if (!farm) throw new HttpError("Can't find farm", 404)

  const data = await Service.getTotalHarvestEachMonth(farm.id)

  return data.rows[0]
}

export async function viewCropStatistics(id: string, userid: string) {
  const user = await findUser(userid)

  if (!user) throw new HttpError('Unathorized', 401)

  const data = await Service.getCropStatistics(id, user.farm_id)

  if (!data) throw new HttpError('No Available Report Data', 404)

  const formattedData = {
    ...data,
    growth_span:
      data?.growth_span +
      (Number(data?.growth_span) > 1 ? ' months' : ' month'),
    seedling_season: getMonthByIndex(Number(data?.seedling_season)),
    planting_season: getMonthByIndex(Number(data?.planting_season)),
    harvest_season: getMonthByIndex(Number(data?.harvest_season)),
  }

  return formattedData
}

export async function leastPerformantCrops(userid: string) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const crops = await Service.findLeastPerformantCrops(user.farm_id)
  return crops
}

export async function listCommuntityCropReports(
  id: string,
  offset: number,
  filterKey: string[] | string,
  searchKey: string,
  month: string,
  perpage: number,
  sortBy: 'desc' | 'asc',
  isExisting?: boolean
) {
  const [data, total] = await Promise.all([
    Service.findCommunityReports(
      id,
      offset,
      filterKey,
      searchKey,
      month,
      perpage,
      sortBy,
      isExisting
    ),
    Service.getTotalReportCount(id, filterKey, searchKey),
  ])

  return { data, total }
}

export async function listExistingCropReports(
  id: string,
  offset: number,
  filterKey: string[] | string,
  searchKey: string,
  perpage: number,
  orderBy: 'desc' | 'asc'
) {
  const [data, total] = await Promise.all([
    Service.findCommunityReports(
      id,
      offset,
      filterKey,
      searchKey,
      '',
      perpage,
      orderBy,
      true
    ),
    Service.getTotalReportCount(id, filterKey, searchKey, true),
  ])

  return { data, total }
}

export async function removeCommunityCropReport(id: string) {
  const report = await Service.findCommunityReportById(id)
  if (!report) throw new HttpError("Can't find report", 404)

  const data = await Service.archiveCommunityCropReport(id)
  return data
}

export async function viewCommunityCropReport(id: string, userid: string) {
  const user = await findUser(userid)

  const report = await Service.findCommunityReportById(id, user.farm_id)
  if (!report) throw new HttpError("Can't find report", 404)

  if (user.farm_id !== report.farmid) {
    throw new HttpError('Unathorized', 401)
  }

  return report
}

export async function markReportAsInactive(id: string, userid: string) {
  const user = await findUser(userid)
  const report = await Service.findCommunityReportById(id, user.farm_id)
  if (!report) throw new HttpError("Can't find report", 404)

  if (user.farm_id !== report.farmid) {
    throw new HttpError('Unathorized', 401)
  }

  await Service.markReportAsInactive(id)
}

export async function listGrowthHarvestStats(userid: string, month?: number) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const farm = await findCommunityFarmById(user.farm_id)
  if (!farm) throw new HttpError("Can't find farm", 404)

  const data = await Service.getGrowthHarvestStats(farm.id, month)

  return data
}

export async function getAverageGrowthRate(userid: string) {
  const user = await findUser(userid)

  const data = await Service.getAverageGrowthRate(user.farm_id)

  // yieldable growth rate=((harvestedqty/(harvestedqty+witheredqty))x100
  // ((parseFloat(plant.harvested_qty as string) / parseFloat(plant.planted_qty as string)) / parseFloat(plant.planted_qty as string)) *100
  const [plant] = data
  // const latestGrowthRate =
  //   (parseFloat(plant.net_yield as string) /
  //     parseFloat(plant.planted_qty as string)) *
  //   100
  const latestGrowthRate =
    plant.type === '1'
      ? (parseFloat(plant.harvested_qty as string) /
          (parseFloat(plant.harvested_qty as string) +
            parseFloat(plant.withered_crops as string))) *
        100
      : (parseFloat(plant.harvested_qty as string) /
          parseFloat(plant.planted_qty as string)) *
        100

  // Calculate the average growth rate
  // const averageGrowthRate =
  //   data.reduce((acc, plant) => {
  //     const growthRate =
  //       plant.type === '1'
  //         ? ((parseFloat(plant.harvested_qty as string) -
  //             parseFloat(plant.planted_qty as string)) /
  //             parseFloat(plant.planted_qty as string)) *
  //           100
  //         : (parseFloat(plant.harvested_qty as string) /
  //             parseFloat(plant.planted_qty as string)) *
  //           100

  //     console.log(growthRate)
  //     return acc + growthRate
  //   }, 0) / data.length
  let sum = 0

  console.log(data, 'DATA NI NIKKI')
  for (let i = 0; i < data.length; i++) {
    const plant = data[i]
    const growthRate =
      plant.type === '1'
        ? (parseFloat(plant.harvested_qty as string) /
            (parseFloat(plant.harvested_qty as string) +
              parseFloat(plant.withered_crops as string))) *
          100
        : (parseFloat(plant.harvested_qty as string) /
            parseFloat(plant.planted_qty as string)) *
          100
    // const growthRate =
    //   parseFloat(plant.crop_yield as string) +
    //   parseFloat(plant.net_yield as string) -
    //   parseFloat(plant.withered_crops as string)

    console.log(growthRate)
    sum += growthRate
  }

  const averageGrowthRate = sum / data.length

  const results = await axios.post(`${process.env.PYTHON_API}/growth-rate`, {
    average_growth: Number(averageGrowthRate.toFixed(2)),
    recent_growth: Number(latestGrowthRate.toFixed(2)),
  })

  return {
    results: results.data.result,
    growth_rate: Number(latestGrowthRate.toFixed(2)),
    average_growth_rate: Number(averageGrowthRate.toFixed(2)),
  }
}

export async function getSuggestedLearningMaterials(userid: string) {
  const user = await findUser(userid)

  // get latest report
  const [data] = await Service.getLatestAverageReports(user.farm_id)

  // get suggested tags from python
  try {
    var suggestedTags = await axios.post(
      `${process.env.PYTHON_API}/suggested-tags`,
      [data]
    )
  } catch (error) {
    log.error('Failed Getting Learning Resource')
  }

  type SuggestedTags = {
    suggested_tags: {
      tags: string[]
    }[]
  }
  const response: SuggestedTags = suggestedTags.data
  console.log(response.suggested_tags, 'REPORTED TAGS FROM ANALYTICS SERVICE')

  // feed dataset from python to our database for query
  const dataSet = response.suggested_tags[0].tags

  const suggestedLearningMaterials = await findLearningMaterialByTags(dataSet)

  return suggestedLearningMaterials
}

export async function listFavouriteCrops() {
  const data = await Service.getFavouriteCrops()

  return data
}

export async function getLowestGrowthRates(order: 'desc' | 'asc') {
  const data = await Service.getLowestGrowthRates(order)

  return data.rows
}

type MonthlyData = {
  january?: number | string
  february?: number | string
  march?: number | string
  april?: number | string
  may?: number | string
  june?: number | string
  july?: number | string
  august?: number | string
  september?: number | string
  october?: number | string
  november?: number | string
  december?: number | string
}

export async function getGrowthRatePerMonth(
  year = new Date().getFullYear(),
  start = 1,
  end = 12
) {
  const monthlyData = await Service.getGrowthRatePerMonth(year, start, end)

  const data = monthlyData.rows[0] as MonthlyData

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  if ((start !== 1 && end !== 12) || start === 1 || end === 12) {
    const startIndex = start - 1
    const endIndex = end - 1

    months.splice(endIndex + 1)

    if (startIndex > 0) {
      months.splice(0, startIndex)
    }
  }

  const dataKeys = Object.keys(data ?? {})
  console.log(monthlyData)

  const formattedData: MonthlyData = {}

  months.map((month: keyof MonthlyData) => {
    const monthIndex = dataKeys.findIndex((e) => e === month.toLowerCase())

    formattedData[month] = Object.values(data ?? {})[monthIndex] ?? '0'
  })

  return formattedData
}

export async function listResourcesCount() {
  const data = await Service.getResourcesCount()
  return data
}

export async function listResourcesCountDetails() {
  const data = await Service.getResourcesCountDetails()
  return data
}

export async function listTotalHarvestPerDistrict() {
  const data = await Service.getTotalHarvestPerDistrict()

  return data.rows
}

export async function getFarmOverview() {
  const data = Service.getFarmOverview()
  return data
}

export async function getForumOverview(
  year = new Date().getFullYear(),
  start = 1,
  end = 12
) {
  const data = await Service.getForumOverview(year, start, end)

  type MonthlyData = {
    month: string
    num_questions: string
    num_answers: string
  }

  const monthlyData = data.rows as MonthlyData[]
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  for (const month of monthlyData) {
    month.month = months[parseInt(month.month) - 1]
  }

  return monthlyData
}

export async function getForumsCount() {
  const data = await Service.getForumsCount()
  return data
}

export async function getCommonListOverview() {
  const data = await Service.getCommonListOverview()
  return data
}

export async function getAnalyticsOverviewPieChart() {
  const data = await Service.getAnalyticsOverviewPieChart()
  return data
}

export async function getUserFeedbackOverview() {
  const data = await Service.getUserFeedbackOverview()
  return data
}

export async function getFarmHarvestDistribution(month: number, limit: number) {
  const data = await Service.getFarmHarvestDistribution(month, limit)

  return data.rows
}

export async function getCropHarvestDistribution(month: number, limit: number) {
  const data = await Service.getCropHarvestDistribution(month, limit)

  return data.rows
}

export async function getCropHarvestDistributionPerFarm(
  month: number,
  limit: number,
  userid: string
) {
  const user = await findUser(userid)

  if (!user) {
    throw new HttpError('Unauthorized', 401)
  }

  const data = await Service.getCropHarvestDistributionPerFarm(
    month,
    limit,
    user.farm_id
  )

  return data.rows
}

export async function getGrowthRateDistribution(month: number, limit: number) {
  const data = await Service.getGrowthRateDistribution(month, limit)

  return data.rows
}

export async function listInactiveFarms(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.listInactiveFarms(offset, searchKey, perpage),
    Service.getTotalInactiveFarms(searchKey),
  ])

  return { data, total }
}

export async function getLandSizeAnalytics() {
  const data = await Service.getLandSizeAnalytics()

  return data
}

export async function getLandSizeAnalyticsPerDistrict(
  district: DistrictType,
  limit: number
) {
  const data = await Service.getLandSizeAnalyticsPerDistrict(district, limit)

  return data
}
