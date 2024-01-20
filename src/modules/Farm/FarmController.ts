import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Interactor from './FarmInteractor'
import * as Schema from '../../schema/FarmSchema'
import { SessionRequest } from '../../types/AuthType'
import { deleteFile } from '../../utils/file'
import { ZodError } from 'zod'

export async function applyFarm(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.NewFarmApplication, req)

    const farmActualImages = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )['farm_actual_images']

    const selfie = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )['selfie'][0]

    const proof = (req.files as { [fieldname: string]: Express.Multer.File[] })[
      'proof'
    ][0]

    const valid_id = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )['valid_id'][0]

    var allImages = [...farmActualImages, selfie, valid_id, proof]

    const userid = req.session.userid

    const newApplication = await Interactor.createFarmApplication({
      farmActualImages,
      application: { body },
      proof,
      selfie,
      userid,
      valid_id,
    })

    res.status(201).json({
      message: 'Application Submitted Successfully',
      data: newApplication,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      for (const image of allImages) {
        deleteFile(image.filename)
      }
    }

    errorHandler(res, error)
  }
}

export async function listFarmApplications(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListFarmSchema, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const applications = await Interactor.listFarmApplication(
      offset,
      filterKey,
      searchKey,
      perPage
    )

    const totalPages = Math.ceil(Number(applications.total.count) / perPage)
    res.status(200).json({
      applications: applications.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(applications.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewFarmApplication(req: Request, res: Response) {
  try {
    const id = req.params.id

    const application = await Interactor.viewFarmApplication(id as string)
    res.status(200).json(application)
  } catch (error) {
    errorHandler(res, error)
  }
}

// public route
export async function listFarms(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListFarmSchema, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const farms = await Interactor.listFarms(offset, searchKey, perPage)

    const totalPages = Math.ceil(Number(farms.total.count) / perPage)
    res.status(200).json({
      farms: farms.data,
      pagination: {
        page: pageNumber,
        per_page: 20,
        total_pages: totalPages,
        total_records: Number(farms.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewFarm(req: Request, res: Response) {
  try {
    const { id } = req.params
    const farm = await Interactor.viewFarm(id)
    res.status(200).json(farm)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewSubFarm(req: SessionRequest, res: Response) {
  try {
    const userid = req.session.userid

    const subfarm = await Interactor.viewSubFarm(userid)
    res.status(200).json(subfarm)
  } catch (error) {
    errorHandler(res, error)
  }
}

// admin route
export async function registerFarm(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewFarmSchema, req)
    // get uploaded file
    const avatar = req.file.filename
    const data = { ...body, avatar }
    // insert data to database
    const newFarm = await Interactor.registerFarm(data, req.file)
    res.status(201).json({ message: 'registered successfully', data: newFarm })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function registerSubFarm(req: Request, res: Response) {
  try {
    const { body, params } = await zParse(Schema.NewSubFarmSchema, req)
    const { farmid, head } = params

    const newSubFarm = await Interactor.registerSubFarm(body, farmid, head)
    res
      .status(201)
      .json({ message: 'registered successfully', data: newSubFarm })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCrops(req: Request, res: Response) {
  try {
    const data = await Interactor.listCrops()
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createCrop(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewCropSchema, req)

    const data = { ...body, image: req.file.filename }
    const newCrop = await Interactor.createCrop(data, req.file)

    res
      .status(201)
      .json({ message: 'crop created successfully', data: newCrop })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createCropReport(req: Request, res: Response) {
  try {
    const { body, params } = await zParse(Schema.NewCropReportSchema, req)
    const { farmid, userid } = params

    const data = { ...body, farmid, userid }

    const newCropReport = await Interactor.createNewCropReport(data)
    res.status(201).json({
      message: 'Crop report successfully created',
      data: newCropReport,
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listActiveCropReports(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session

    const reports = await Interactor.listActiveCropReports(userid)
    res.status(200).json(reports)
  } catch (error) {
    errorHandler(res, error)
  }
}
