import { Multer } from 'multer'
import { NewReportedUser, UpdateUser } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import * as Service from './UserService'
import { deleteFile } from '../../utils/file'
import dbErrorHandler from '../../utils/dbErrorHandler'
import {
  deleteFileCloud,
  getObjectUrl,
  uploadFiles,
} from '../AWS-Bucket/UploadService'
import { emitPushNotification } from '../Notifications/NotificationInteractor'

export async function listUsers(
  offset: number,
  perpage: number,
  filterKey?: string,
  searchKey?: string
) {
  const [data, total] = await Promise.all([
    Service.listUsers(offset, perpage, filterKey, searchKey),
    Service.getTotalUsers(),
  ])

  return { data, total }
}

export async function findUserProfile(username: string) {
  const user = await Service.findByEmailOrUsername(username)
  if (!user) throw new HttpError('User not found', 404)
  delete user.password
  user.avatar = getObjectUrl(user.avatar)

  return user
}

export async function updateUserProfile(
  userId: string,
  sessionid: string,
  user: UpdateUser,
  avatar: Express.Multer.File
) {
  try {
    const foundUser = await Service.findUser(userId)

    if (!foundUser) throw new HttpError('User not found', 404)

    if (sessionid !== foundUser.id) {
      throw new HttpError('Unauthorized', 401)
    }

    if (avatar?.filename) {
      if (foundUser.avatar) deleteFileCloud(foundUser.avatar)
      await uploadFiles([avatar])
    }

    const updateUser = await Service.updateUser(userId, {
      ...user,
      avatar: avatar?.filename ? avatar?.filename : foundUser.avatar,
    })
    delete updateUser.password
    return updateUser
  } catch (error) {
    deleteFile(avatar?.filename)
    dbErrorHandler(error)
  }
}

export async function listMembers(
  offset: number,
  perpage: number,
  searchKey: string,
  userid: string
) {
  const farmhead = await Service.findUser(userid)

  const [data, total] = await Promise.all([
    Service.findMembers(offset, perpage, searchKey, farmhead.farm_id),
    Service.getTotalMembers(farmhead.farm_id),
  ])

  return { data, total }
}

export async function listAdmins(
  offset: number,
  perpage: number,
  searchKey: string,
  filterKey: 'banned' | 'active'
) {
  const [data, total] = await Promise.all([
    Service.findAdmins(offset, perpage, searchKey, filterKey),
    Service.getTotalAdmins(filterKey),
  ])

  return { data, total }
}

export async function disableAdminAccount(id: string) {
  const user = await Service.findUser(id)

  if (!user) {
    throw new HttpError('User not found', 404)
  }

  if (user.role !== 'asst_admin') {
    throw new HttpError('Account is not admin', 400)
  }

  const updateObject: UpdateUser = {
    isbanned: true,
  }

  await Service.updateUser(id, updateObject)

  const sess = await Service.clearUserSession(id)
  console.log(sess, 'TESTIFy')
}

export async function enableAdminAccount(id: string) {
  const user = await Service.findUser(id)

  if (!user) {
    throw new HttpError('User not found', 404)
  }

  if (user.role !== 'asst_admin') {
    throw new HttpError('Account is not admin', 400)
  }

  const updateObject: UpdateUser = {
    isbanned: false,
  }

  await Service.updateUser(id, updateObject)
}

export async function reportUser(
  userid: string,
  report: NewReportedUser,
  evidence: Express.Multer.File[]
) {
  try {
    const reportedUser = await Service.findUser(report.reported as string)

    if (!reportedUser) {
      throw new HttpError('User Not Found', 404)
    }

    const fileName = evidence.map((item) => item.filename)

    const reportObject: NewReportedUser = {
      ...report,
      reported_by: userid,
      evidence: fileName,
    }

    if (!evidence.length) {
      throw new HttpError('Evidence is required', 400)
    }

    await uploadFiles(evidence)

    for (const file of evidence) {
      deleteFile(file.filename)
    }

    const newReportedUser = await Service.createReportedUser(reportObject)

    return newReportedUser
  } catch (error) {
    for (const file of evidence) {
      deleteFile(file.filename)
    }
    dbErrorHandler(error)
  }
}

export async function sendingWarningToUser(id: string) {
  const report = await Service.findReportedUser(id)
  if (!report) {
    throw new HttpError('Report not found', 404)
  }
  await Service.updateReportedUser(id, { status: 'warned' })

  await emitPushNotification(
    report.reported,
    'Reported',
    `You have been reported for (${report.reason})`
  )
}

export async function listReportedUsers(
  offset: number,
  perpage: number,
  searchKey: string,
  filterKey: 'pending' | 'warned'
) {
  const [data, total] = await Promise.all([
    Service.findReportedUsers(offset, perpage, searchKey, filterKey),
    Service.getTotalReportedUsers(),
  ])

  return { data, total }
}

export async function banUserAccount(id: string) {
  const user = Service.findUser(id)

  if (!user) throw new HttpError('User Not Found', 404)

  await Service.updateUser(id, { isbanned: true })
}

export async function unbanUserAccount(id: string) {
  const user = Service.findUser(id)

  if (!user) throw new HttpError('User Not Found', 404)

  await Service.updateUser(id, { isbanned: false })
}

export async function listBannedUsers(
  offset: number,
  perpage: number,
  searchKey: string
) {
  const [data, total] = await Promise.all([
    Service.findBannedUsers(offset, perpage, searchKey),
    Service.getTotalBannedUsers(),
  ])

  return { data, total }
}
