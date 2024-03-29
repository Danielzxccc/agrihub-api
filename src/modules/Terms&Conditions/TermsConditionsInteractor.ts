import HttpError from '../../utils/HttpError'
import * as Service from './TermsConditionsService'
import { UpdateTermsConditions } from '../../types/DBTypes'

export async function listTermsConditions() {
  const contents = await Service.listTermsConditions()
  if (!contents) throw new HttpError('Missing or not found', 400)

  return contents
}

export async function updateTermsConditions(body: UpdateTermsConditions) {
  const content: UpdateTermsConditions = { ...body }
  const updatedTermsConditions = await Service.updateTermsConditions(content)

  if (!updatedTermsConditions) throw new HttpError('Missing or not found', 400)
  return updatedTermsConditions
}
