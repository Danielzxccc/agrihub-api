import * as Service from './TagsService'
import HttpError from '../../utils/HttpError'

export async function findTags(tag: string) {
  const tags = await Service.findTags(tag)
  return tags
}

export async function getTags(
  offset: number,
  filterKey: string,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.getTags(offset, filterKey, searchKey, perpage),
    Service.getTotalCount(),
  ])

  if (!data || data.length === 0) {
    throw new HttpError('No tags were found', 404)
  }

  return { data, total }
}
