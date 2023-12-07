import { NewFarm, NewSubFarm } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile, readFileAsStream } from '../../utils/file'
import { uploadFile } from '../AWS-Bucket/UploadService'
import * as Service from './FarmService'
import fs from 'fs'

export async function listFarms(
  offset: number,
  searchQuery: string,
  perpage: number
) {
  const farms = await Service.listFarms(offset, searchQuery, perpage)

  return farms
}

export async function viewFarm(id: string) {
  const farm = await Service.viewFarm(id)

  if (!farm) throw new HttpError('Farm not found', 404)

  return farm
}

export async function registerFarm(farm: NewFarm, image: Express.Multer.File) {
  try {
    const newFarm = await Service.createFarm(farm)
    const fileKey = image.filename
    const stream: fs.ReadStream = await readFileAsStream(image.path)
    await uploadFile(stream, fileKey, image.mimetype)
    return newFarm
  } catch (error) {
    deleteFile(image.filename)
    dbErrorHandler(error)
  }
}

export async function registerSubFarm(subFarm: NewSubFarm, id: string) {
  const farm = await Service.findFarm(id)

  if (!farm) throw new HttpError('Farm not found', 404)

  const newSubFarm = await Service.createSubFarm(subFarm)

  return newSubFarm
}
