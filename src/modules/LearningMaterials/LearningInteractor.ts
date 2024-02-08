import {
  NewLearningMaterialT,
  NewLearningResourceT,
} from '../../schema/LearningMaterialSchema'
import {
  NewLearningCredits,
  NewLearningMaterial,
  NewLearningResource,
  NewLearningTags,
  UpdateLearningMaterial,
} from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import { deleteFileCloud } from '../AWS-Bucket/UploadService'
import * as Service from './LearningService'

export async function viewLearningMaterial(id: string) {
  const learningMaterial = await Service.findLearningMaterialDetails(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  return learningMaterial
}

export async function createDraftLearningMaterial(
  material: NewLearningMaterialT
) {
  const learningMaterial: NewLearningMaterial = {
    ...material.body,
    status: 'draft',
  }

  const newLearningMaterial = await Service.insertLearningMaterial(
    learningMaterial
  )

  return newLearningMaterial
}

export async function updateDraftLearningMaterial(
  id: string,
  material: UpdateLearningMaterial
) {
  const findLearningMaterial = await Service.findLearningMaterial(id)

  if (!findLearningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  const learningMaterial: UpdateLearningMaterial = {
    ...material,
    status: 'draft',
  }

  const updatedLearningMaterial = await Service.updateLearningMaterial(
    id,
    learningMaterial
  )

  return updatedLearningMaterial
}

export async function createLearningResource(
  id: string,
  image: Express.Multer.File,
  resource: NewLearningResourceT
) {
  const learningMaterial = await Service.findLearningMaterial(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  const resourceType = image?.filename
    ? image?.filename
    : resource.body?.resource || null

  const learningResource: NewLearningResource = {
    ...resource.body,
    resource: resourceType,
    learning_id: id,
  }

  const newLearningResource = await Service.insertLearningResource(
    learningResource
  )

  return newLearningResource
}

export async function removeLearningResource(id: string) {
  const learningResource = await Service.findLearningResource(id)

  if (!learningResource) {
    throw new HttpError('Learning Resource Not Found', 404)
  }

  if (learningResource.type === 'image') {
    await deleteFileCloud(learningResource.resource)
  }

  await Service.deleteLearningResource(id)
}

export async function createLearningCredits(
  id: string,
  credit: NewLearningCredits
) {
  const learningMaterial = await Service.findLearningMaterial(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  const learningCredits: NewLearningCredits = {
    ...credit,
    learning_id: id,
  }

  const newLearningCredits = await Service.insertLearningCredits(
    learningCredits
  )

  return newLearningCredits
}

export async function removeLearningCredits(id: string) {
  const learningCredits = await Service.findLearningCredits(id)

  if (!learningCredits) {
    throw new HttpError('Learning Credit Not Found', 404)
  }

  await Service.deleteLearningCredits(id)
}

export async function createLearningTags(id: string, tags: string[] | string) {
  const learningMaterial = await Service.findLearningMaterial(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  let learningTags: NewLearningTags[] | NewLearningTags

  if (Array.isArray(tags)) {
    learningTags = tags.map((item) => {
      return {
        tag_id: item,
        learning_id: id,
      }
    })
  } else {
    learningTags = {
      tag_id: tags,
      learning_id: id,
    }
  }

  const newLearningTags = await Service.insertLearningTags(learningTags)
  return newLearningTags
}

export async function removeLearningTags(id: string) {
  const learningTag = await Service.findLearningTag(id)

  console.log(id)
  if (!learningTag) {
    throw new HttpError('Learning Tag Not Found', 404)
  }

  await Service.deleteLearningTag(id)
}
