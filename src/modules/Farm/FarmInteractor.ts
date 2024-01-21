import { FarmApplicationStatus } from 'kysely-codegen'
import { NewFarmApplicationT } from '../../schema/FarmSchema'
import {
  NewCommunityFarm,
  NewCrop,
  NewCropReport,
  NewFarm,
  NewFarmApplication,
  NewSubFarm,
} from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile, readFileAsStream } from '../../utils/file'
import {
  getObjectUrl,
  replaceAvatarsWithUrls,
  uploadFile,
  uploadFiles,
} from '../AWS-Bucket/UploadService'
import { findUser, updateUser } from '../Users/UserService'
import { IFarmApplication } from './FarmInterface'
import * as Service from './FarmService'
import fs from 'fs'
import { emitNotificationToAdmin } from '../Socket/SocketController'

export async function createFarmApplication({
  application,
  farmActualImages,
  selfie,
  proof,
  userid,
  valid_id,
}: IFarmApplication) {
  try {
    // check files
    if (!farmActualImages || !selfie || !proof || !valid_id) {
      throw new HttpError('Incomplete Details', 400)
    }
    const farm_actual_images = farmActualImages.map((item) => item.filename)

    const pendingApplication: NewFarmApplication = {
      ...application.body,
      applicant: userid,
      selfie: selfie.filename,
      proof: proof.filename,
      farm_actual_images,
      valid_id: valid_id.filename,
    }

    const allFiles = [...farmActualImages, selfie, proof, valid_id]
    // batch upload in cloud
    await uploadFiles(allFiles)

    // delete files in disk after uploading

    for (const image of allFiles) {
      deleteFile(image.filename)
    }

    const newApplication = await Service.createFarmApplication(
      pendingApplication
    )

    return newApplication
  } catch (error) {
    // delele local files if error occured
    const allFiles = [...farmActualImages, selfie, proof, valid_id]
    for (const image of allFiles) {
      deleteFile(image.filename)
    }
    dbErrorHandler(error)
  }
}

// list farm application
export async function listFarmApplication(
  offset: number,
  filterKey: FarmApplicationStatus,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findFarmApplications(offset, filterKey, searchKey, perpage),
    Service.getTotalFarmApplications(),
  ])

  const formattedDates = data.map((item) => ({
    ...item,
    createdat: item.createdat.toString().slice(0, -3) + 'Z',
    updatedat: item.updatedat.toString().slice(0, -3) + 'Z',
  }))

  const formattedData = await replaceAvatarsWithUrls(formattedDates)
  emitNotificationToAdmin()
  return { data: formattedData, total }
}

export async function viewFarmApplication(id: string) {
  const data = await Service.findOneFarmApplication(id)

  if (!data) throw new HttpError('Application not found', 404)

  const formattedActualImages = data.farm_actual_images.map((item) =>
    getObjectUrl(item)
  )
  data.farm_actual_images = formattedActualImages
  data.selfie = getObjectUrl(data.selfie)
  data.proof = getObjectUrl(data.proof)
  data.valid_id = getObjectUrl(data.valid_id)
  data.createdat = data.createdat.toString().slice(0, -3) + 'Z'
  data.updatedat = data.updatedat.toString().slice(0, -3) + 'Z'

  const formattedData = await replaceAvatarsWithUrls(data)

  return formattedData
}

export async function acceptFarmApplication(id: string) {
  const farm = await Service.findOneFarmApplication(id)

  if (!farm) throw new HttpError('Farm Application not found', 404)

  const updatedFarmApplication = await Service.updateFarmApplication(farm.id, {
    status: 'approved',
  })

  const newFarm: NewCommunityFarm = {
    farm_name: updatedFarmApplication.farm_name,
    location: updatedFarmApplication.location,
    description: '',
    farm_head: updatedFarmApplication.applicant,
    district: updatedFarmApplication.district,
    size: updatedFarmApplication.farm_size,
    application_id: updatedFarmApplication.id,
  }

  // update user
  const newCommunityFarm = await Service.createNewCommunityFarm(newFarm)

  const farmHead = await findUser(farm.applicant.id)
  await updateUser(farmHead.id, {
    farm_id: newCommunityFarm.id,
    role: 'farm_head',
  })

  return newCommunityFarm
}

export async function listFarms(
  offset: number,
  searchQuery: string,
  perpage: number
) {
  const [farms, total] = await Promise.all([
    Service.listFarms(offset, searchQuery, perpage),
    Service.getTotalCount(),
  ])

  for (let farm of farms) {
    farm.avatar = farm.avatar ? getObjectUrl(farm.avatar) : farm.avatar
  }
  return { data: farms, total }
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

export async function viewSubFarm(id: string) {
  const user = await findUser(id)

  if (!user) throw new HttpError('User not Found', 404)

  if (user.role === 'subfarm_head') {
    const farmHeadView = await Service.viewSubFarm(id, true)
    return farmHeadView
  } else if (user.role === 'farmer') {
    const member = await Service.findMember(id)
    if (!member) throw new HttpError('Unauthorized', 401)

    const farmerView = await Service.viewSubFarm(member.farmid, false)
    return farmerView
  } else {
    throw new HttpError('Unauthorized', 401)
  }
}

export async function listCrops() {
  const crops = await Service.findAllCrops()

  return crops
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
  if (!crops) throw new HttpError('Crop not found', 404)
  if (!head) throw new HttpError('User not found', 404)

  const newCropReport = await Service.createCropReport(crop)

  return newCropReport
}

export async function listActiveCropReports(userid: string) {
  const subFarm = await Service.viewSubFarm(userid, true)

  if (!subFarm) throw new HttpError('Unauthorized', 401)
  const reports = await Service.listCropReports(subFarm.id)
  return reports
}
