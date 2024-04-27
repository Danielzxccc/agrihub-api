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
