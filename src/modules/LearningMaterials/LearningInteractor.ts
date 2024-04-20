import { sql } from 'kysely'
import {
  NewLearningMaterialT,
  NewLearningResourceT,
} from '../../schema/LearningMaterialSchema'
import {
  NewLearningCredits,
  NewLearningMaterial,
  NewLearningResource,
  NewLearningTags,
  UpdateLearningCredits,
  UpdateLearningMaterial,
  UpdateLearningResource,
} from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import {
  deleteFileCloud,
  getObjectUrl,
  uploadFiles,
} from '../AWS-Bucket/UploadService'
import * as Service from './LearningService'
import { ZodError, z } from 'zod'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile } from '../../utils/file'

export async function viewLearningMaterial(id: string) {
  const learningMaterial = await Service.findLearningMaterialDetails(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  for (const material of learningMaterial.learning_resource) {
    if (material.type === 'image') {
      material.resource = getObjectUrl(material.resource)
    }
  }

  return learningMaterial
}

export async function viewPublishedLearningMaterial(id: string) {
  const learningMaterial = await Service.findPublishedLearningMaterial(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  if (learningMaterial.status === 'draft') {
    throw new HttpError('Learning Material Not Found', 404)
  }

  for (const material of learningMaterial.learning_resource) {
    if (material.type === 'image') {
      material.resource = getObjectUrl(material.resource)
    }
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
  try {
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

    // upload to cloud
    if (image?.filename) {
      await uploadFiles([image])
    }

    // delete to local
    deleteFile(image?.filename)

    return newLearningResource
  } catch (error) {
    deleteFile(image?.filename)
    dbErrorHandler(error)
  }
}

export async function updateLearningResource(
  id: string,
  image: Express.Multer.File,
  resource: UpdateLearningResource
) {
  try {
    const resourceObject = await Service.findLearningResource(id)

    if (!resourceObject) {
      throw new HttpError('Learning Resource Not Found', 404)
    }

    const resourceType = image?.filename
      ? image?.filename
      : resource.resource
      ? resource.resource
      : resourceObject.resource

    const learningResource: NewLearningResource = {
      ...resource,
      resource: resourceType,
    }

    const newLearningResource = await Service.updateLearningResource(
      id,
      learningResource
    )

    // upload to cloud
    if (image?.filename) {
      await uploadFiles([image])
    }

    // delete to local
    deleteFile(image?.filename)

    return newLearningResource
  } catch (error) {
    deleteFile(image?.filename)
    dbErrorHandler(error)
  }
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

export async function updateLearningCredits(
  id: string,
  credits: UpdateLearningCredits
) {
  const creditObject = await Service.findLearningCredits(id)
  if (!creditObject) {
    throw new HttpError('Learning Credit Not Found', 404)
  }

  const updatedLearningCredits = await Service.updateLearningCredits(
    id,
    credits
  )

  return updatedLearningCredits
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

export async function listDraftLearningMaterials(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findDraftLearningMaterials(offset, searchKey, perpage),
    Service.getTotalDraftLearningMaterials(searchKey),
  ])

  return { data, total }
}

export async function listPublishedLearningMaterials(
  offset: number,
  searchKey: string,
  perpage: number,
  filterKey: string,
  sortBy: 'desc' | 'asc'
) {
  const [data, total] = await Promise.all([
    Service.findPublishedLearningMaterials(
      offset,
      searchKey,
      perpage,
      filterKey,
      sortBy
    ),
    Service.getTotalPublishedLearningMaterials(searchKey, filterKey),
  ])

  return { data, total }
}

export async function publishLearningMaterial(id: string) {
  const learningMaterial = await Service.findLearningMaterialDetails(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  if (learningMaterial.learning_resource.length <= 0) {
    throw new HttpError('You must have at least one learning resource.', 400)
  }

  if (learningMaterial.learning_credits.length <= 0) {
    throw new HttpError('You must have at least one learning credits.', 400)
  }

  if (learningMaterial.tags.length <= 0) {
    throw new HttpError('You must have at least one learning tags.', 400)
  }

  if (
    !learningMaterial.learning_resource.some((resource) => resource.is_featured)
  ) {
    throw new HttpError('Set atleast one featured resource', 400)
  }

  const validation = z.object({
    title: z.string({ required_error: 'title is required' }),
    content: z.string({ required_error: 'content is required' }),
    type: z.string({ required_error: 'type is required' }),
    language: z.string({ required_error: 'language is required' }),
    status: z.string({ required_error: 'status is required' }),
  })

  try {
    await validation.parseAsync(learningMaterial)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError('validation error', 400, error.errors)
    }
    throw new HttpError('validation error', 400)
  }

  const publishedObject: UpdateLearningMaterial = {
    status: 'published',
  }

  await Service.publishLearningMaterial(id, publishedObject)
}

export async function setFeaturedLearningResource(
  learningid: string,
  id: string
) {
  const learningMaterial = await Service.findLearningMaterial(learningid)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  const learningResource = await Service.findLearningResource(id)

  if (!learningResource) {
    throw new HttpError('Learning Resource Not Found', 404)
  }

  await Promise.all([
    Service.setLearningResourceAsFeatured(learningid, id),
    Service.setIsFeaturedToFalse(learningid, id),
  ])
}

export async function unpublishLearningMaterial(id: string) {
  const learningMaterial = await Service.findLearningMaterial(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  const updateObject: UpdateLearningMaterial = {
    status: 'draft',
  }

  await Service.updateLearningMaterial(id, updateObject)
}

export async function removeLearningMaterial(id: string) {
  const learningMaterial = await Service.findLearningMaterial(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  if (learningMaterial.status !== 'draft') {
    throw new HttpError("You can't delete published learning materials", 401)
  }

  await Service.deleteLearningMaterial(id)
}

export async function archiveLearningMaterial(id: string) {
  const learningMaterial = await Service.findLearningMaterial(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  const updatedObject: UpdateLearningMaterial = {
    is_archived: true,
  }

  await Service.updateLearningMaterial(id, updatedObject)
}

export async function unArchiveLearningMaterial(id: string) {
  const learningMaterial = await Service.findLearningMaterial(id)

  if (!learningMaterial) {
    throw new HttpError('Learning Material Not Found', 404)
  }

  const updatedObject: UpdateLearningMaterial = {
    is_archived: false,
  }

  await Service.updateLearningMaterial(id, updatedObject)
}

export async function listArchivedLearningMaterials(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findArchivedLearningMaterials(offset, searchKey, perpage),
    Service.getTotalArchivedLearningMaterials(searchKey),
  ])

  return { data, total }
}

export async function listRelatedLearningMaterials(tags: string[] | string) {
  const learningMaterials = await Service.findRelatedLearningMaterials(tags)

  return learningMaterials
}
