import * as Service from './TagsService'
import HttpError from '../../utils/HttpError'
import { NewTag } from '../../types/DBTypes'

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
    Service.getTotalCount(filterKey, searchKey),
  ])

  if (!data || data.length === 0) {
    throw new HttpError('No tags were found', 404)
  }

  return { data, total }
}

export async function createTag(tag: NewTag) {
  const data = await Service.createTag(tag)

  return data
}

export async function viewTag(id: string) {
  const data = await Service.viewTag(id)

  if (!data) {
    throw new HttpError('Tag Not Found', 404)
  }

  return data
}

export async function deleteTag(id: string) {
  const deletedTag = await Service.deleteTag(id)

  if (!deletedTag) {
    throw new HttpError('Tag Not Found', 404)
  }
}
