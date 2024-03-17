import { ClientDetails } from '../../schema/CmsSchema'
import { NewUserFeedback } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import { deleteFileCloud } from '../AWS-Bucket/UploadService'
import * as Service from './CmsService'

export async function findClientDetails() {
  const data = await Service.findClientDetails()
  return data
}

export async function updateClientDetails(data: ClientDetails) {
  await Service.updateClientDetails(data)
}

export async function deleteClientSocial(id: string) {
  const deletedData = await Service.deleteClientSocial(id)
  if (!deletedData) throw new HttpError('Item not found', 404)
}

export async function deleteClientPartner(id: string) {
  const deletedData = await Service.deleteClientPartner(id)
  if (!deletedData) throw new HttpError('Item not found', 404)
  await deleteFileCloud(deletedData?.logo ?? '')
}

export async function deleteClientMember(id: string) {
  const deletedData = await Service.deleteClientMember(id)
  if (!deletedData) throw new HttpError('Item not found', 404)

  await deleteFileCloud(deletedData?.image ?? '')
}

export async function createUserFeedback(feedback: NewUserFeedback) {
  const newFeedBack = await Service.createUserFeedback(feedback)

  return newFeedBack
}

export async function listUserFeedbacks(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findUserFeedbacks(offset, searchKey, perpage),
    Service.getTotalUserFeedbacks(searchKey),
  ])

  return { data, total }
}
