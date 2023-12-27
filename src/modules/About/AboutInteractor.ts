import HttpError from '../../utils/HttpError'
import { AddImage, UpdateAbout } from '../../types/DBTypes'
import * as Service from './AboutService'
import fs from 'fs'
import { deleteFile, readFileAsStream } from '../../utils/file'
import { getObjectUrl, uploadFile } from '../AWS-Bucket/UploadService'
import dbErrorHandler from '../../utils/dbErrorHandler'

export async function updateAbout(body: UpdateAbout) {
  const update = await Service.updateAboutPage(body)

  if (!update) throw new HttpError('Missing or not found, Check syntax', 400)
  return update
}

export async function addImage(body: AddImage, image: Express.Multer.File) {
  try {
    const fileKey = image.filename
    const stream: fs.ReadStream = await readFileAsStream(image.path)
    await uploadFile(stream, fileKey, image.mimetype)
    const data = { ...body, imagesrc: image.filename }
    const addImage = await Service.addImage(data)

    deleteFile(image.filename)

    if (!addImage) throw new HttpError('Failed: Empty or not found', 400)
    return { ...addImage, imagesrc: getObjectUrl(fileKey) }
  } catch (error) {
    deleteFile(image.filename)
    dbErrorHandler(error)
  }
}
