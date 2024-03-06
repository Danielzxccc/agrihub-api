import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './CmsInteractor'
import * as Schema from '../../schema//CmsSchema'
import zParse from '../../utils/zParse'

export async function findClientDetails(req: Request, res: Response) {
  try {
    const data = await Interactor.findClientDetails()

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateClientDetails(req: Request, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateClientDetails, req)

    await Interactor.updateClientDetails({ body })

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteClientSocial(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteClientSocial(id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteClientPartner(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteClientPartner(id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteClientMember(req: Request, res: Response) {
  try {
    const { id } = req.params

    await Interactor.deleteClientMember(id)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}
