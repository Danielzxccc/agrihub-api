import { SessionRequest } from '../../types/AuthType'
import { Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import zParse from '../../utils/zParse'
import * as Interactor from './PrivacyPolicyInteractor'
import * as Schema from '../../schema/PrivacyPolicySchema'

export async function listPrivacyPolicy(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    const details = await Interactor.listPrivacyPolicy()
    res.status(200).json(details)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updatePrivacyPolicy(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdatePrivacyPolicy, req)

    const updatedPrivacyPolicy = await Interactor.updatePrivacyPolicy(body)
    res
      .status(200)
      .json({ message: 'Updated Successfully', data: updatedPrivacyPolicy })
  } catch (error) {
    errorHandler(res, error)
  }
}
