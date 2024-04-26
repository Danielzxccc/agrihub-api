import { findUser } from '../modules/Users/UserService'
import HttpError from './HttpError'

export async function getUserOrThrow(userid: string) {
  const user = await findUser(userid)

  if (!user) {
    throw new HttpError('Unauthorized', 401)
  }

  return user
}
