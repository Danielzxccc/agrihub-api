import { Response } from 'express'
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
      body,
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

export async function viewCropStatistics(req: SessionRequest, res: Response) {
  try {
    const { name } = req.params

    const data = await Interactor.viewCropStatistics(name)
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
