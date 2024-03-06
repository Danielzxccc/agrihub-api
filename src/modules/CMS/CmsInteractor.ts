import * as Service from './CmsService'

export async function findClientDetails() {
  const data = await Service.findClientDetails()
  return data
}
