import HttpError from '../../utils/HttpError'
import * as Service from './UserService'

export async function findUserProfile(username: string) {
  const user = await Service.findByEmailOrUsername(username)
  if (!user) throw new HttpError('User not found', 404)
  delete user.password
  return user
}
