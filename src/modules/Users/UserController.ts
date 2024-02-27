import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './UserInteractor'
import * as Schema from '../../schema/UserSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'

export async function listUsers(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListUserSchema, req)
    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const users = await Interactor.listUsers(
      offset,
      perPage,
      filterKey,
      searchKey
    )
    const totalPages = Math.ceil(Number(users.total.count) / perPage)
    res.status(200).json({
      users: users.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(users.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function findUserProfile(req: Request, res: Response) {
  try {
    const { params } = await zParse(Schema.UserProfile, req)
    const user = await Interactor.findUserProfile(params.username)
    res.status(200).json(user)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateUserProfile(req: SessionRequest, res: Response) {
  try {
    const { params, body } = await zParse(Schema.UpdateProfile, req)
    const sessionId = req.session.userid
    const avatar = req.file

    const updatedUser = await Interactor.updateUserProfile(
      params.id,
      sessionId,
      body,
      avatar
    )
    res
      .status(200)
      .json({ message: 'Profile updated successfully', user: updatedUser })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listMembers(req: SessionRequest, res: Response) {
  try {
    const { query } = await zParse(Schema.ListUserSchema, req)
    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const { userid } = req.session

    const members = await Interactor.listMembers(
      offset,
      perPage,
      searchKey,
      userid
    )

    const totalPages = Math.ceil(Number(members.total.count) / perPage)
    res.status(200).json({
      members: members.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(members.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listAdmins(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListAdminSchema, req)
    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const users = await Interactor.listAdmins(
      offset,
      perPage,
      searchKey,
      filterKey
    )
    const totalPages = Math.ceil(Number(users.total.count) / perPage)
    res.status(200).json({
      users: users.data,
      pagination: {
        page: pageNumber,
        per_page: perPage,
        total_pages: totalPages,
        total_records: Number(users.total.count),
      },
    })
  } catch (error) {
    errorHandler(res, error)
  }
}
