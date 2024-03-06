import { ClientDetails } from '../../schema/CmsSchema'
import HttpError from '../../utils/HttpError'
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
}

export async function deleteClientMember(id: string) {
  const deletedData = await Service.deleteClientMember(id)
  if (!deletedData) throw new HttpError('Item not found', 404)
}
