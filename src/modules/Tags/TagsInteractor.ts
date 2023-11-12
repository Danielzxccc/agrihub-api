import * as Service from './TagsService'

export async function findTags(tag: string) {
  const tags = await Service.findTags(tag)
  return tags
}

export async function getNewForums(offset = 0, limit = 20) {
  try {
    const newForums = await Service.getNewForums(offset, limit)
    // You can add additional business logic or data processing here if needed
    return newForums
  } catch (error) {
    throw new Error('Error in Forum Interactor: ' + error.message)
  }
}

export async function getPopularForums() {
  try {
    const popularForums = await Service.getPopularForums()
    // You can add additional business logic or data processing here if needed
    return popularForums
  } catch (error) {
    throw new Error('Error in Forum Interactor: ' + error.message)
  }
}
