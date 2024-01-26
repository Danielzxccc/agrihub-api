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
  deleteFileCloud,
  getObjectUrl,
  replaceAvatarsWithUrls,
  uploadFile,
  uploadFiles,
} from '../AWS-Bucket/UploadService'
import { findUser, updateUser } from '../Users/UserService'
import { IFarmApplication } from './FarmInterface'
import * as Service from './FarmService'
import fs from 'fs'
import {
  emitNotification,
  emitNotificationToAdmin,
} from '../Socket/SocketController'

export async function createFarmApplication({
  application,
  farmActualImages,
  proof,
  userid,
  valid_id,
}: IFarmApplication) {
  try {
    // check if user has existing application
    const checkApplication = await Service.findExistingApplication(userid)
    if (checkApplication)
      throw new HttpError(
        'It appears that you currently have an active application in progress.',
        401
      )

    // check files
    if (!farmActualImages || !proof || !valid_id) {
      throw new HttpError('Incomplete Details', 400)
    }
    const farm_actual_images = farmActualImages.map((item) => item.filename)

    const pendingApplication: NewFarmApplication = {
      ...application.body,
      applicant: userid,
      selfie: '',
      farm_actual_images,
      valid_id: valid_id.filename,
    }

    const allFiles = [...farmActualImages, proof, valid_id]
    // batch upload in cloud
    await uploadFiles(allFiles)

    // delete files in disk after uploading

    for (const image of allFiles) {
      deleteFile(image.filename)
    }

    const newApplication = await Service.createFarmApplication(
      pendingApplication
    )

    emitNotificationToAdmin('A new application has been received.')

    return newApplication
  } catch (error) {
    // delele local files if error occured
    const allFiles = [...farmActualImages, proof, valid_id]
    for (const image of allFiles) {
      deleteFile(image.filename)
    }
    dbErrorHandler(error)
  }
}

export async function listCommunityFarms(
  perpage: number,
  offset: number,
  search: string,
  filter: string
) {
  const [data, total] = await Promise.all([
    Service.findAllCommunityFarms(perpage, offset, search, filter),
    Service.getTotalCommunityFarms(),
  ])

  for (const farm of data) {
    farm.avatar = farm.avatar ? getObjectUrl(farm.avatar) : farm.avatar
    farm.cover_photo = farm.cover_photo
      ? getObjectUrl(farm.cover_photo)
      : farm.cover_photo
  }

  return { data, total }
}

export async function checkExistingApplication(userid: string) {
  const application = await Service.findExistingApplication(userid)
  if (!application) {
    throw new HttpError('No application is currently in progress.', 400)
  }

  const formattedActualImages = application.farm_actual_images.map((item) =>
    getObjectUrl(item)
  )
  application.farm_actual_images = formattedActualImages
  application.selfie = getObjectUrl(application.selfie)
  application.proof = getObjectUrl(application.proof)
  application.valid_id = getObjectUrl(application.valid_id)

  return application
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

  return { data: formattedData, total }
}

// public view of community farm
export async function viewCommunityFarm(id: string) {
  const communityFarm = await Service.findCommunityFarmById(id)

  if (!communityFarm) throw new HttpError('Community Farm Not Found', 404)

  const { cover_photo, avatar } = communityFarm

  communityFarm.cover_photo = cover_photo
    ? getObjectUrl(cover_photo)
    : cover_photo
  communityFarm.avatar = avatar ? getObjectUrl(avatar) : avatar

  return communityFarm
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

  emitNotification(
    farm.applicant.id,
    'Your Farm Application has been successfully accepted.'
  )

  return newCommunityFarm
}

export async function rejectFarmApplication(id: string) {
  const farm = await Service.findOneFarmApplication(id)
  if (!farm) throw new HttpError('Farm Application not found', 404)

  const application = await Service.updateFarmApplication(farm.id, {
    status: 'rejected',
  })
  return application
}

export async function cancelExistingApplication(id: string, userid: string) {
  const existingApplication = await Service.findOneFarmApplication(id)

  if (!existingApplication)
    throw new HttpError('The application is not recognized.', 400)

  if (userid !== existingApplication.applicant.id) {
    throw new HttpError("You Can't Delete other's application", 401)
  }

  await Service.deleteFarmApplicaiton(id)
}

export async function registerCropInFarmCommunity(
  farm_id: string,
  crop_id: string,
  userid: string
) {
  try {
    const [farm, crop] = await Promise.all([
      Service.findCommunityFarmById(farm_id),
      Service.findCrop(crop_id),
    ])

    if (!farm) {
      throw new HttpError("Can't find farm", 404)
    }

    if (!crop[0]) {
      throw new HttpError("Can't find crop", 404)
    }

    if (farm.farm_head !== userid) {
      throw new HttpError('Unauthorized', 401)
    }

    const createdCrop = await Service.insertCommunityFarmCrop({
      farm_id,
      crop_id,
    })

    return createdCrop
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError('Crop Already Exists', 400)
    } else {
      dbErrorHandler(error)
    }
  }
}

export async function listCommunityFarmCrops(id: string) {
  try {
    const crops = await Service.findCommunityFarmCrops(id)

    for (const crop of crops) {
      crop.image = getObjectUrl(crop.image)
    }

    return crops
  } catch (error) {
    dbErrorHandler(error)
  }
}

export async function createCommunityGallery(
  userid: string,
  images: Express.Multer.File[],
  description: string
) {
  try {
    if (!images.length) throw new HttpError('Image is required', 400)
    const user = await findUser(userid)

    const newImages = []

    for (const image of images) {
      newImages.push({
        farm_id: user.farm_id,
        imagesrc: image.filename,
        description,
      })
    }

    const imageObject = await Service.insertCommunityFarmImage(newImages)

    //upload in loud
    await uploadFiles(images)

    //  delete locol files
    for (const image of images) {
      deleteFile(image.filename)
    }

    return imageObject
  } catch (error) {
    for (const image of images) {
      deleteFile(image.filename)
    }
    dbErrorHandler(error)
  }
}

export async function removeCommunityFarmImage(
  id: string,
  userid: string
): Promise<void> {
  const [image, user] = await Promise.all([
    Service.findOneCommunityFarmImage(id),
    findUser(userid),
  ])

  if (!image) {
    throw new HttpError("Can't find image", 404)
  }

  if (image.farm_id !== user.farm_id) {
    throw new HttpError('Unauthorized', 401)
  }

  await deleteFileCloud(image.imagesrc)

  await Service.deleteCommunityFarmImage(id)
}

export async function listCommunityFarmGallery(id: string) {
  const farm = await Service.findCommunityFarmById(id)

  if (!farm) throw new HttpError("Can't find farm", 404)

  const gallery = await Service.findCommunityFarmImages(id)

  for (const image of gallery) {
    image.imagesrc = getObjectUrl(image.imagesrc)
  }
  return gallery
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
