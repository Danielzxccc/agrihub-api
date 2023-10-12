import * as Service from '../service/UserService'
import HttpError from '../utils/HttpError'
import dbErrorHandler from '../utils/dbErrorHandler'

export async function authenticateUser(username: string, password: string) {
  try {
    const user = await Service.findUserByUsername(username)

    if (!user) {
      throw new HttpError('Unautorized', 400)
    }

    return user
  } catch (error) {
    dbErrorHandler(error)
  }
}
