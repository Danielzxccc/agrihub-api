import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './UserInteractor'
import * as Schema from '../../schema/UserSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'
import { deleteFile } from '../../utils/file'
import { createAuditLog } from '../AuditLogs/AuditLogsInteractor'

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

export async function disableAdminAccount(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await Interactor.disableAdminAccount(id)

    await createAuditLog({
      action: 'Disabled an admin account',
      section: 'Admin Management',
      userid: req.session.userid,
    })
    res.status(200).json({ message: 'Disabled Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function enableAdminAccount(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await Interactor.enableAdminAccount(id)

    await createAuditLog({
      action: 'Disabled an admin account',
      section: 'Admin Management',
      userid: req.session.userid,
    })

    res.status(200).json({ message: 'Enabled Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function reportUser(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.NewReportedUser, req)
    const { userid } = req.session
    const evidence = req.files as Express.Multer.File[]

    console.log(evidence)

    const data = await Interactor.reportUser(userid, body, evidence)

    res.status(200).json({ message: 'Reported Successfully', data })
  } catch (error) {
    const evidence = req.files as Express.Multer.File[]
    if (evidence?.length) {
      for (const file of evidence) {
        deleteFile(file.filename)
      }
    }
    errorHandler(res, error)
  }
}

export async function listReportedUsers(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListReportedUsers, req)
    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)
    const filterKey = query.filter

    const users = await Interactor.listReportedUsers(
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

export async function banUserAccount(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await Interactor.banUserAccount(id)

    await createAuditLog({
      action: 'Banned a user account',
      section: 'Users Management',
      userid: req.session.userid,
    })
    res.status(200).json({ message: 'Banned Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function unbanUserAccount(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await Interactor.unbanUserAccount(id)

    await createAuditLog({
      action: 'Unbanned a user account',
      section: 'Users Management',
      userid: req.session.userid,
    })
    res.status(200).json({ message: 'Unbanned Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function listBannedUsers(req: Request, res: Response) {
  try {
    const { query } = await zParse(Schema.ListAdminSchema, req)
    const perPage = Number(query.perpage)
    const pageNumber = Number(query.page) || 1
    const offset = (pageNumber - 1) * perPage
    const searchKey = String(query.search)

    const users = await Interactor.listBannedUsers(offset, perPage, searchKey)
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

export async function sendingWarningToUser(req: SessionRequest, res: Response) {
  try {
    const { id } = req.params
    await Interactor.sendingWarningToUser(id)

    await createAuditLog({
      action: 'Sent a warning to a user account',
      section: 'Users Management',
      userid: req.session.userid,
    })
    res.status(200).json({ message: 'Warning Sent Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function deleteUserProfilePicture(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session
    await Interactor.deleteUserProfilePicture(userid)

    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateUserTags(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session
    const { body } = await zParse(Schema.UserTagsUpdate, req)
    await Interactor.updateUserTags(userid, body.tags)

    res.status(200).json({ message: 'Updated Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function findUserPreferredTags(
  req: SessionRequest,
  res: Response
) {
  try {
    const { userid } = req.session

    const data = await Interactor.findUserPreferredTags(userid)

    res.status(200).json(data)
  } catch (error) {
    errorHandler(res, error)
  }
}
