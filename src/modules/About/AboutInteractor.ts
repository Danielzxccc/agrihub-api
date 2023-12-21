import HttpError from '../../utils/HttpError'
import { UpdateAbout } from '../../types/DBTypes'
import * as Service from './AboutService'

export async function updateAbout(body: UpdateAbout) {
  const update = await Service.updateAboutPage(body)

  if (!update) throw new HttpError('Missing or not found, Check syntax', 400)
  return update
}
