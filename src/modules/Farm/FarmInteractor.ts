import {
  NewCrop,
  NewCropReport,
  NewFarm,
  NewSubFarm,
} from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile, readFileAsStream } from '../../utils/file'
import { getObjectUrl, uploadFile } from '../AWS-Bucket/UploadService'
import { findUser } from '../Users/UserService'
import * as Service from './FarmService'
import fs from 'fs'

export async function listFarms(
  offset: number,
  searchQuery: string,
  perpage: number
) {
  const farms = await Service.listFarms(offset, searchQuery, perpage)

  for (let farm of farms) {
    farm.avatar = farm.avatar ? getObjectUrl(farm.avatar) : farm.avatar
  }
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

export async function registerSubFarm(
  subFarm: NewSubFarm,
  id: string,
  farm_head: string
) {
  const [farm, head] = await Promise.all([
    Service.findFarm(id),
    findUser(farm_head),
  ])

  if (!farm) throw new HttpError('Farm not found', 404)
  if (!head) throw new HttpError('User not found', 404)

  const newSubFarm = await Service.createSubFarm({
    ...subFarm,
    farm_head,
    farmid: id,
  })

  return newSubFarm
}

export async function createCrop(crop: NewCrop, image: Express.Multer.File) {
  try {
    const foundCrop = await Service.findCropByName(crop.name)

    if (foundCrop) throw new HttpError('crop already exists', 400)

    const fileKey = image.filename
    const stream: fs.ReadStream = await readFileAsStream(image.path)
    await uploadFile(stream, fileKey, image.mimetype)
    const newCrop = await Service.createCrop(crop)
    return newCrop
  } catch (error) {
    deleteFile(image.filename)
    dbErrorHandler(error)
  }
}

export async function createNewCropReport(crop: NewCropReport) {
  const [farm, crops, head] = await Promise.all([
    Service.findSubFarm(String(crop.farmid)),
    Service.findCrop(String(crop.crop_id)),
    findUser(String(crop.userid)),
  ])

  if (!farm) throw new HttpError('Farm not found', 404)
  if (!crops) throw new HttpError('Farm not found', 404)
  if (!head) throw new HttpError('User not found', 404)

  const newCropReport = await Service.createCropReport(crop)

  return newCropReport
}
