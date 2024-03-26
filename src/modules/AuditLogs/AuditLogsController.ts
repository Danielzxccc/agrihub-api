import { Request, Response } from 'express'
import zParse from '../../utils/zParse'
import * as Interactor from './AuditLogsInteractor'
import * as Schema from '../../schema/AuditLogsSchema'
import errorHandler from '../../utils/httpErrorHandler'
import { SessionRequest } from '../../types/AuthType'

export async function findAuditLogs(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.ListAuditLogs, req)

    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const events = await Interactor.findAuditLogs(
      offset,
      searchKey,
      perPage,
      req.session.userid
    )

    const totalPages = Math.ceil(Number(events.total.count) / perPage)
    res.status(200).json({
      data: events.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(events.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
