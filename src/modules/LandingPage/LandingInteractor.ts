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

export async function listLandingPageDetails(id: string) {
  const details = await Service.listLandingPageDetails(id)
  if (!details) throw new HttpError('Not found', 400)
  return details
}

export async function listApproach(id: string) {
  const details = await Service.listApproach(id)
  if (!details) throw new HttpError('Not found', 400)
  return details
}

export async function listImages(landing_id: string) {
  const images = await Service.listImages(landing_id)

  if (!images) throw new HttpError('No images found', 400)
  return images
}

export async function updateApproach(body: UpdateApproach) {
  const update = await Service.updateApproach(body)
  if (!update) throw new HttpError('Missing or not found, check syntax', 400)
  return update
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
    const data = { ...body, images: image.filename }
    const addImage = await Service.addImage(data)

    deleteFile(image.filename)

    if (!addImage) throw new HttpError('Failed: Empty or not found', 400)
    return { ...addImage, imagesrc: getObjectUrl(fileKey) }
  } catch (error) {
    deleteFile(image.filename)
    dbErrorHandler(error)
  }
}

export async function deleteImage(id: string) {
  const deleteImage = await Service.deleteImage(id)

  deleteFileCloud(deleteImage.images)

  if (!deleteImage) throw new HttpError('Image currently does not exist', 400)
  return deleteImage
}
