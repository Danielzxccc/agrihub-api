import HttpError from '../../utils/HttpError'
import { NewCommunityFarmReport } from '../../types/DBTypes'
import { findCommunityFarmById, findCrop } from '../Farm/FarmService'
import * as Service from './ReportsService'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile } from '../../utils/file'
import { findUser } from '../Users/UserService'
import { uploadFiles } from '../AWS-Bucket/UploadService'
import { getMonthByIndex } from '../../utils/utils'
import axios from 'axios'

export async function createCommunityCropReport(
  userid: string,
  report: NewCommunityFarmReport,
  images: Express.Multer.File[]
) {
  try {
    const user = await findUser(userid)
    if (!userid) throw new HttpError('Unathorized', 401)

    const farm = await findCommunityFarmById(user.farm_id)

    if (!farm) throw new HttpError("Can't find farm", 404)
    if (userid !== farm.farm_head) throw new HttpError('Unathorized', 401)

    const crop = await Service.findCommunityFarmCrop(report.crop_id as string)
    if (!crop) throw new HttpError("Can't find crop", 404)

    const [parentCrop] = await findCrop(crop.crop_id)

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

export async function listWitheredHarvestedCrops(userid: string) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const farm = await findCommunityFarmById(user.farm_id)
  if (!farm) throw new HttpError("Can't find farm", 404)

  const data = await Service.getHarvestedAndWitheredCrops(farm.id)
  return data
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
  perpage: number,
  sortBy: string
) {
  const [data, total] = await Promise.all([
    Service.findCommunityReports(
      id,
      offset,
      filterKey,
      searchKey,
      perpage,
      sortBy
    ),
    Service.getTotalReportCount(),
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
  const report = await Service.findCommunityReportById(id)
  if (!report) throw new HttpError("Can't find report", 404)

  const user = await findUser(userid)

  if (user.farm_id !== report.farmid) {
    throw new HttpError('Unathorized', 401)
  }

  return report
}

export async function listGrowthHarvestStats(userid: string) {
  const user = await findUser(userid)
  if (!user) throw new HttpError('Unauthorized', 401)

  const farm = await findCommunityFarmById(user.farm_id)
  if (!farm) throw new HttpError("Can't find farm", 404)

  const data = await Service.getGrowthHarvestStats(farm.id)

  return data
}

export async function getAverageGrowthRate(userid: string) {
  const user = await findUser(userid)

  const data = await Service.getAverageGrowthRate(user.farm_id)
  const [first] = data
  const latestGrowthRate =
    [first].reduce((acc, plant) => {
      const growthRate =
        plant.type === '1'
          ? ((parseInt(plant.harvested_qty as string) -
              parseInt(plant.planted_qty as string)) /
              parseInt(plant.planted_qty as string)) *
            100
          : (parseInt(plant.harvested_qty as string) /
              parseInt(plant.planted_qty as string)) *
            100
      return acc + growthRate
    }, 0) / 1

  // Calculate the average growth rate
  const averageGrowthRate =
    data.slice(1).reduce((acc, plant) => {
      const growthRate =
        plant.type === '1'
          ? ((parseInt(plant.harvested_qty as string) -
              parseInt(plant.planted_qty as string)) /
              parseInt(plant.planted_qty as string)) *
            100
          : (parseInt(plant.harvested_qty as string) /
              parseInt(plant.planted_qty as string)) *
            100
      return acc + growthRate
    }, 0) / data.slice(1).length

  console.log(data, 'GET')

  const results = await axios.post(`${process.env.PYTHON_API}/growth-rate`, {
    average_growth: Number(averageGrowthRate.toFixed(2)),
    recent_growth: Number(latestGrowthRate.toFixed(2)),
  })

  return results.data
}
