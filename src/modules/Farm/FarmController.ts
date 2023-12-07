import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Interactor from './FarmInteractor'
import * as Schema from '../../schema/FarmSchema'

// public route
export async function listFarms(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListFarmSchema, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const farms = await Interactor.listFarms(offset, searchKey, perPage)
    res.status(200).json(farms)
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

// admin route
export async function registerFarm(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.NewFarmSchema, req)
    // get uploaded file
    const cover_photo = req.file.filename
    const data = { ...body, cover_photo }
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

    const data = { ...body, farmid, farm_head: head }
    const newSubFarm = await Interactor.registerSubFarm(data, farmid)
    res
      .status(201)
      .json({ message: 'registered successfully', data: newSubFarm })
  } catch (error) {
    errorHandler(res, error)
  }
}
