import { NewLearningMaterialT } from '../../schema/LearningMaterialSchema'
import {
  NewLearningMaterial,
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
