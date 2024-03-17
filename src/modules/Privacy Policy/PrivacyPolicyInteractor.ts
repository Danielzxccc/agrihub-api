import HttpError from '../../utils/HttpError'
import * as Service from './PrivacyPolicyService'
import { UpdatePrivacyPolicy } from '../../types/DBTypes'

export async function listPrivacyPolicy() {
  const details = await Service.listPrivacyPolicy()
  if (!details) throw new HttpError('Missing or not found', 400)

  return details
}

export async function updatePrivacyPolicy(body: UpdatePrivacyPolicy) {
  const content: UpdatePrivacyPolicy = {
    ...body,
  }
  const updatedPrivacyPolicy = await Service.updatePrivacyPolicy(content)

  if (!updatedPrivacyPolicy) throw new HttpError('Missing or not found', 400)
  return updatedPrivacyPolicy
}
