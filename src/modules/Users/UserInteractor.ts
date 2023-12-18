import { Multer } from 'multer'
import { UpdateUser } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import * as Service from './UserService'
import { deleteFile } from '../../utils/file'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { getObjectUrl } from '../AWS-Bucket/UploadService'

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
  avatar: string
) {
  try {
    const foundUser = await Service.findUser(userId)

    if (!foundUser) throw new HttpError('User not found', 404)

    if (sessionid !== foundUser.id) {
      throw new HttpError('Unauthorized', 401)
    }

    if (avatar) {
      if (foundUser.avatar) deleteFile(foundUser.avatar)
    }

    const updateUser = await Service.updateUser(userId, {
      ...user,
      avatar: avatar ? avatar : foundUser.avatar,
    })
    delete updateUser.password
    return updateUser
  } catch (error) {
    deleteFile(avatar)
    dbErrorHandler(error)
  }
}
