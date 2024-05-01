import { Response, application } from 'express'
import { SessionRequest } from '../../types/AuthType'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import { deleteLocalFiles } from '../../utils/utils'
import * as Schema from '../../schema/CommunityFarmSchema'
import * as Interactor from './CommunityInteractor'

export async function createNewFarmQuestion(
  req: SessionRequest,
  res: Response
) {
  try {
    const { body } = await zParse(Schema.FarmQuestion, req)
    const { userid } = req.session

    await Interactor.createNewFarmQuestion(userid, { body })

    res.status(200).json({ message: 'Created Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function findFarmQuestions(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    const data = await Interactor.findFarmQuestions(id)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteFarmQuestion(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.deleteFarmQuestion(userid, id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function joinCommunityFarm(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session
    const application = await zParse(Schema.FarmMemberApplication, req)

    var proof_selfie = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )['proof_selfie'][0]

    var valid_id = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )['valid_id'][0]

    const requestObject = {
      farmid: id,
      userid,
      proof_selfie,
      valid_id,
      application,
    }

    await Interactor.joinCommunityFarm(requestObject)

    res.status(200).json({ message: 'Applied Successfully' })
  } catch (error) {
    deleteLocalFiles([proof_selfie, valid_id])
    errorHandler(res, error)
  }
}

export async function listFarmerApplications(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.ListFarmerApplications, req)
    const { id } = req.params
    const { userid } = req.session

    const perpage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perpage
    const searchKey = String(query.search)
    const filter = query.filter

    const data = await Interactor.listFarmerApplications({
      farmid: id,
      offset,
      filter,
      perpage,
      searchKey,
      userid,
    })

    const totalPages = Math.ceil(Number(data.total.count) / perpage)
    res.status(200).json({
      data: data.data,
      pagination: {
        page: pageNumber,
        per_page: perpage,
        total_pages: totalPages,
        total_records: Number(data.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function findFarmerApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session

    const data = await Interactor.findFarmerApplication(userid, id)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateApplicationStatus(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateFarmerApplicationStatus, req)

    await Interactor.updateApplicationStatus(id, body.status, body.remarks)

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function cancelFarmerApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.cancelFarmerApplication(userid, id)

    res.status(200).json({ message: 'Cancelled Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function checkExistingFarmerApplication(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session

    const data = await Interactor.checkExistingFarmerApplication(userid)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createPlantedReport(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session
    const requestObject = await zParse(Schema.PlantedCropReport, req)
    const images = req.files as Express.Multer.File[]

    await Interactor.createPlantedReport({
      farmid: id,
      report: requestObject,
      userid,
      images,
    })

    res.status(200).json({ message: 'Submitted Successfully' })
  } catch (error) {
    const images = req.files as Express.Multer.File[]
    deleteLocalFiles(images)
    errorHandler(res, error)
  }
}

export async function listPlantedCropReports(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.CommunityCropReports, req)
    const { id } = req.params

    const perpage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perpage
    const searchKey = String(query.search)
    const filterKey = query.filter
    const month = query.month
    const status = query.status
    const order = query.order
    const previous_id = query.previous_id

    const data = await Interactor.listPlantedCropReports({
      farmid: id,
      offset,
      filterKey,
      perpage,
      searchKey,
      month,
      status,
      order,
      previous_id,
    })

    const totalPages = Math.ceil(Number(data.total.count) / perpage)
    res.status(200).json({
      data: data.data,
      pagination: {
        page: pageNumber,
        per_page: perpage,
        total_pages: totalPages,
        total_records: Number(data.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createHarvestedReport(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session
    const requestObject = await zParse(Schema.HarvestedCropReport, req)
    const images = req.files as Express.Multer.File[]

    await Interactor.createHarvestedReport({
      id,
      report: requestObject,
      userid,
      images,
    })

    res.status(200).json({ message: 'Submitted Successfully' })
  } catch (error) {
    const images = req.files as Express.Multer.File[]
    deleteLocalFiles(images)
    errorHandler(res, error)
  }
}

export async function createPlantedCommunityTask(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewPlantTask, req)
    const { userid } = req.session

    await Interactor.createPlantedCommunityTask({
      farmid: id,
      assigned_to: body.assigned_to,
      crop_id: body.crop_id,
      due_date: body.due_date,
      message: body.message,
      userid,
    })

    res.status(200).json({ message: 'Created Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createHarvestTask(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.NewHarvestTask, req)
    const { userid } = req.session

    await Interactor.createHarvestTask({
      farmid: id,
      assigned_to: body.assigned_to,
      report_id: body.report_id,
      due_date: body.due_date,
      message: body.message,
      userid,
    })

    res.status(200).json({ message: 'Created Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCommunityTasks(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.ListCommunityTasks, req)
    const { id } = req.params

    const perpage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perpage
    const searchKey = String(query.search)
    const filter = query.filter
    const type = query.type

    const data = await Interactor.listCommunityTasks({
      farmid: id,
      offset,
      filter,
      perpage,
      searchKey,
      type,
    })

    const totalPages = Math.ceil(Number(data.total.count) / perpage)
    res.status(200).json({
      data: data.data,
      pagination: {
        page: pageNumber,
        per_page: perpage,
        total_pages: totalPages,
        total_records: Number(data.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCommunityTasksByFarmer(
  req: SessionRequest,
  res: Response
) {
  try {
    const { query } = await zParse(Schema.ListCommunityTasks, req)
    const { id } = req.params
    const { userid } = req.session

    const perpage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perpage
    const searchKey = String(query.search)
    const filter = query.filter
    const type = query.type

    const data = await Interactor.listCommunityTasks({
      farmid: id,
      userid,
      offset,
      filter,
      perpage,
      searchKey,
      type,
    })

    const totalPages = Math.ceil(Number(data.total.count) / perpage)
    res.status(200).json({
      data: data.data,
      pagination: {
        page: pageNumber,
        per_page: perpage,
        total_pages: totalPages,
        total_records: Number(data.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteCommunityTask(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.deleteCommunityTask(userid, id)
    res.status(200).json({ message: 'Deleted Successfuly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function createCommunityEvent(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.CreateCommunityEvent, req)
    const banner = req.file

    await Interactor.createCommunityEvent({ body }, banner)
    res.status(200).json({ message: 'Created Successfuly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteCommunityEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.deleteCommunityEvent(id, userid)
    res.status(200).json({ message: 'Deleted Successfuly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listCommunityEvents(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.ListCommunityEvents, req)
    const { id } = req.params
    const { userid } = req.session

    const perpage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perpage
    const searchKey = String(query.search)
    const type = query.type
    const filter = query.filter

    const data = await Interactor.listCommunityEvents({
      farmid: id,
      offset,
      perpage,
      searchKey,
      type,
      filter,
      userid,
    })

    const totalPages = Math.ceil(Number(data.total.count) / perpage)
    res.status(200).json({
      data: data.data,
      pagination: {
        page: pageNumber,
        per_page: perpage,
        total_pages: totalPages,
        total_records: Number(data.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateCommunityEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { body } = await zParse(Schema.UpdateCommunityEvent, req)
    const banner = req.file

    await Interactor.updateCommunityEvent(id, { body }, banner)
    res.status(200).json({ message: 'Updated Successfuly' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewCommunityEvent(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session

    const data = await Interactor.viewCommunityEvent(userid, id)
    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function eventAction(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const { userid } = req.session
    const { body } = await zParse(Schema.EventAction, req)

    await Interactor.eventAction(id, userid, body.action)
    res.status(200).json({ mesage: 'Success' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function removeExistingCropReport(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params
    const { userid } = req.session

    await Interactor.removeExistingCropReport(id, userid)
    res.status(200).json({ mesage: 'Success' })
  } catch (error) {
    errorHandler(res, error)
  }
}
