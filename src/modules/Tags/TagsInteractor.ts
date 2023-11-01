import * as Service from './TagsService'

export async function findTags(tag: string) {
  const tags = await Service.findTags(tag)
  return tags
}
