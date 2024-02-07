import {
  NewLearningMaterialT,
  NewLearningResourceT,
} from '../../schema/LearningMaterialSchema'
import {
  NewLearningCredits,
  NewLearningMaterial,
  NewLearningResource,
  UpdateLearningMaterial,
} from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import * as Service from './LearningService'

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
  const learningMaterial = await Service.findLearningResource(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Resource Not Found', 404)
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
