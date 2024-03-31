import errorHandler from '../../utils/httpErrorHandler'
import { SessionRequest } from '../../types/AuthType'
import { Response } from 'express'
import zParse from '../../utils/zParse'
import * as Interactor from './TermsConditionsInteractor'
import * as Schema from '../../schema/TermsConditions'
import { createAuditLog } from '../AuditLogs/AuditLogsInteractor'

export async function listTermsConditions(req: SessionRequest, res: Response) {
  try {
    const contents = await Interactor.listTermsConditions()
    res.status(200).json(contents)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateTermsConditions(
  req: SessionRequest,
  res: Response
) {
  try {
    const { body } = await zParse(Schema.UpdateTermsConditions, req)

    const updatedTermsConditions = await Interactor.updateTermsConditions(body)

    await createAuditLog({
      action: 'Updated Terms and Conditions',
      section: 'Terms and Conditions Management',
      userid: req.session.userid,
    })

    res
      .status(200)
      .json({ message: 'Updated Successfully', data: updatedTermsConditions })
  } catch (error) {
    errorHandler(res, error)
  }
}
