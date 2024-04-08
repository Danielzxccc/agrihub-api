import { Request, Response } from 'express'
import { SessionRequest } from '../../types/AuthType'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './ReportsInteractor'
import * as Schema from '../../schema/ReportsSchema'
import zParse from '../../utils/zParse'
import { ZodError } from 'zod'
import { deleteFile } from '../../utils/file'
import axios from 'axios'

export async function createCommunityCropReport(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const { body } = await zParse(Schema.NewCommunityCropReport, req)
    const images = req.files as Express.Multer.File[]

    const newReport = await Interactor.createCommunityCropReport(
      userid,
      { body },
      images
    )

    res
      .status(201)
      .json({ message: 'Report successfully submitted.', data: newReport })
  } catch (error) {
    if (error instanceof ZodError) {
      for (const image of req.files as Express.Multer.File[]) {
        deleteFile(image.filename)
      }
    }
    errorHandler(res, error)
  }
}

export async function listWitheredHarvestedCrops(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session

    const data = await Interactor.listWitheredHarvestedCrops(userid)
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listAllWitheredHarvestedCrops(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.FilterWitheredHarvested, req)

    const data = await Interactor.listAllWitheredHarvestedCrops(
      query.year,
      query.start,
      query.end
    )
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listTotalHarvestedCrops(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session

    const data = await Interactor.listTotalHarvestedCrops(userid)
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listTotalPlantedCrops(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const data = await Interactor.listTotalPlantedCrops(userid)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listTotalHarvestEachMonth(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const data = await Interactor.listTotalHarvestEachMonth(userid)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewCropStatistics(req: SessionRequest, res: Response) {
  try {
    const { name } = req.params
    const { userid } = req.session

    const data = await Interactor.viewCropStatistics(name, userid)
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function leastPerformantCrops(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session

    const data = await Interactor.leastPerformantCrops(userid)

    const suggestions = await axios.post(
      'http://localhost:5000/pre-defined',
      data
    )

    res.status(200).json(suggestions.data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCommuntityCropReports(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query, params } = await zParse(Schema.CommunityCropReports, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter
    const sortBy = query.sort

    const reports = await Interactor.listCommuntityCropReports(
      params.id,
      offset,
      filterKey,
      searchKey,
      perPage,
      sortBy
    )

    const totalPages = Math.ceil(Number(reports.total.count) / perPage)
    res.status(200).json({
      reports: reports.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(reports.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listExistingCropReports(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query, params } = await zParse(Schema.CommunityCropReports, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter
    const sortBy = query.sort

    const reports = await Interactor.listExistingCropReports(
      params.id,
      offset,
      filterKey,
      searchKey,
      perPage,
      sortBy
    )

    const totalPages = Math.ceil(Number(reports.total.count) / perPage)
    res.status(200).json({
      reports: reports.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(reports.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewCommunityCropReport(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session

    const report = await Interactor.viewCommunityCropReport(id, userid)
    res.status(200).json(report)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function markReportAsInactive(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.markReportAsInactive(id, userid)
    res.status(200).json({ message: 'Report successfully set to inactive.' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeCommunityCropReport(req: Request, res: Response) {
  try {
    const { id } = req.params

    const archivedReport = await Interactor.removeCommunityCropReport(id)

    res
      .status(200)
      .json({ message: 'Report successfully removed.', data: archivedReport })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listGrowthHarvestStats(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const data = await Interactor.listGrowthHarvestStats(userid)
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getAverageGrowthRate(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session
    const data = await Interactor.getAverageGrowthRate(userid)
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getSuggestedLearningMaterials(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    const data = await Interactor.getSuggestedLearningMaterials(userid)
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listFavouriteCrops(req: SessionRequest, res: Response) {
  try {
    const data = await Interactor.listFavouriteCrops()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getLowestGrowthRates(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.GetHarvestRanking, req)
    const data = await Interactor.getLowestGrowthRates(query.order)
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getGrowthRatePerMonth(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.FilterWitheredHarvested, req)
    const data = await Interactor.getGrowthRatePerMonth(
      query.year,
      query.start,
      query.end
    )
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listResourcesCount(req: SessionRequest, res: Response) {
  try {
    const data = await Interactor.listResourcesCount()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listResourcesCountDetails(
  req: SessionRequest,
  res: Response
) {
  try {
    const data = await Interactor.listResourcesCountDetails()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listTotalHarvestPerDistrict(
  req: SessionRequest,
  res: Response
) {
  try {
    const data = await Interactor.listTotalHarvestPerDistrict()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getFarmOverview(req: SessionRequest, res: Response) {
  try {
    const data = await Interactor.getFarmOverview()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getForumOverview(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.FilterWitheredHarvested, req)
    const data = await Interactor.getForumOverview(
      query.year,
      query.start,
      query.end
    )
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getForumsCount(req: SessionRequest, res: Response) {
  try {
    const data = await Interactor.getForumsCount()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getCommonListOverview(
  req: SessionRequest,
  res: Response
) {
  try {
    const data = await Interactor.getCommonListOverview()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getAnalyticsOverviewPieChart(
  req: SessionRequest,
  res: Response
) {
  try {
    const data = await Interactor.getAnalyticsOverviewPieChart()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getUserFeedbackOverview(
  req: SessionRequest,
  res: Response
) {
  try {
    const data = await Interactor.getUserFeedbackOverview()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getFarmHarvestDistribution(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.GetHarvestDistribution, req)

    const data = await Interactor.getFarmHarvestDistribution(
      query.month,
      query.limit
    )
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getCropHarvestDistribution(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.GetHarvestDistribution, req)

    const data = await Interactor.getCropHarvestDistribution(
      query.month,
      query.limit
    )
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}
