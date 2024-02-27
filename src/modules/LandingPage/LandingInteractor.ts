import fs from 'fs'
import { deleteFile, readFileAsStream } from '../../utils/file'
import {
  deleteFileCloud,
  getObjectUrl,
  uploadFile,
} from '../AWS-Bucket/UploadService'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { AddImage } from '../../schema/LandingPageSchema'
import HttpError from '../../utils/HttpError'
import {
  AddImageLanding,
  UpdateApproach,
  UpdateLanding,
} from '../../types/DBTypes'
import * as Service from './LandingService'

export async function listLandingPageDetails() {
  const details = await Service.listLandingPageDetails()
  if (!details) throw new HttpError('Not found', 400)
  return details
}

export async function updateLanding(body: UpdateLanding) {
  const update = await Service.updateLanding(body)

  if (!update) throw new HttpError('Missing or not found, check syntax', 400)
  return update
}

export async function addImage(
  body: AddImageLanding,
  image: Express.Multer.File
) {
  try {
    const fileKey = image.filename
    const stream: fs.ReadStream = await readFileAsStream(image.path)
    await uploadFile(stream, fileKey, image.mimetype)
    const data: AddImageLanding = {
      ...body,
      landing_id: 1,
      images: image.filename,
    }
    const addImage = await Service.InsertImage(data)

    deleteFile(image.filename)

    if (!addImage) throw new HttpError('Failed: Empty or not found', 404)
    return { ...addImage, imagesrc: getObjectUrl(fileKey) }
  } catch (error) {
    deleteFile(image.filename)
    dbErrorHandler(error)
  }
}

export async function deleteImage(id: string) {
  const image = await Service.findImage(id)

  if (!image) throw new HttpError('Image not found', 404)
  const deleteImage = await Service.deleteImage(id)

  await deleteFileCloud(deleteImage.images)
}

export async function listImages(landing_id: string) {
  const images = await Service.listImages(landing_id)

  return images
}

// export async function listApproach(id: string) {
//   const details = await Service.listApproach(id)
//   if (!details) throw new HttpError('Not found', 400)
//   return details
// }

export async function updateApproach(body: UpdateApproach) {
  const update = await Service.upsertApproach(body)
  if (!update) throw new HttpError('Missing or not found, check syntax', 400)
  return update
}

export async function removeApproach(id: string) {
  const approach = await Service.deleteApproach(id)

  if (!approach) throw new HttpError('Approach not found', 404)

  return
}
