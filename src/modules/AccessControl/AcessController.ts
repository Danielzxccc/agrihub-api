import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './AccessInteractor'
import * as Schema from '../../schema/AccessControlSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'
import { createAuditLog } from '../AuditLogs/AuditLogsInteractor'

export async function createNewAdmin(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.NewAdmin, req)
    const { email, password, access } = body

    const data = await Interactor.createNewAdmin({ email, password }, access)

    await createAuditLog({
      action: 'Created New Admin',
      section: 'Admin Management',
      userid: req.session.userid,
    })

    res.status(201).json({ message: 'Created Successfully', data })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateAdminAccess(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.UpdateAccessControl, req)
    const { id } = req.params

    await Interactor.updateAdminAccess(id, body)

     await createAuditLog({
      action: 'Updated Admin Access',
      section: 'Admin Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function viewAdminAccess(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params

    const data = await Interactor.viewAdminAccess(id)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}
