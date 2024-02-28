import { Multer } from 'multer'
import { UpdateUser } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import * as Service from './UserService'
import { deleteFile } from '../../utils/file'
import dbErrorHandler from '../../utils/dbErrorHandler'
import {
  deleteFileCloud,
  getObjectUrl,
  uploadFiles,
} from '../AWS-Bucket/UploadService'

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
    role: 'asst_admin',
  }

  await Service.updateUser(id, updateObject)

  await Service.clearUserSession(id)
}
