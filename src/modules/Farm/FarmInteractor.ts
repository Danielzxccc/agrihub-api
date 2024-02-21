import { FarmApplicationStatus } from 'kysely-codegen'
import {
  NewFarmApplicationT,
  UpdateCommunityFarmT,
} from '../../schema/FarmSchema'
import {
  NewCommunityFarm,
  NewCrop,
  NewCropReport,
  NewFarm,
  NewFarmApplication,
  NewFarmerInvitation,
  NewSubFarm,
  UpdateCommunityFarm,
  UpdateCrop,
  UpdateUser,
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
import { getMonthByIndex } from '../../utils/utils'
import { emitPushNotification } from '../Notifications/NotificationInteractor'

export async function createFarmApplication({
  application,
  farmActualImages,
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
    if (!farmActualImages || !valid_id) {
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

    const allFiles = [...farmActualImages, valid_id]
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
    const allFiles = [...farmActualImages, valid_id]
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
  const { valid_id, farm_actual_images } = existingApplication

  const allFiles = [...farm_actual_images, valid_id]

  for (const file of allFiles) {
    await deleteFileCloud(file)
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
      crop.growth_span =
        crop?.growth_span +
        (Number(crop?.growth_span) > 1 ? ' months' : ' month')
      crop.seedling_season = getMonthByIndex(Number(crop?.seedling_season))
      crop.planting_season = getMonthByIndex(Number(crop?.planting_season))
      crop.harvest_season = getMonthByIndex(Number(crop?.harvest_season))
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

  for (const crop of crops) {
    crop.image = getObjectUrl(crop.image)
  }

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

export async function createFarmerInvitation(
  userid: string,
  expiresat: string,
  farm_head_id: string
) {
  const farmhead = await findUser(farm_head_id)

  const farm = await Service.findCommunityFarmById(farmhead.farm_id)
  if (!farm) throw new HttpError('Farm not found', 404)

  if (farmhead.id === userid) {
    throw new HttpError('Self-invitations are not allowed.', 400)
  }

  const user = await findUser(userid)
  if (!user) throw new HttpError('User not found', 404)

  if (user.role === 'farmer' || user.role === 'farm_head') {
    throw new HttpError('User is already registered as a farmer.', 400)
  }

  // check if there's an existing invitaion
  const checkExistingInvitation = await Service.findFarmerInvitationByUser(
    userid,
    farm.id
  )

  if (checkExistingInvitation) {
    throw new HttpError('User has already been invited.', 400)
  }

  const invitation: NewFarmerInvitation = {
    userid,
    farmid: farmhead.farm_id,
    expiresat,
  }

  const famerInvitaion = await Service.insertFarmerInvitation(invitation)

  const notificationTitle = 'Invitation'
  const notificationBody = `${farm.farm_name} invited you to join the community.`
  await emitPushNotification(
    userid,
    notificationTitle,
    notificationBody,
    `/invite/farm/${famerInvitaion.id}`
  )

  return famerInvitaion
}

export async function acceptFarmerApplication(
  invitationId: string,
  userid: string
) {
  const invitation = await Service.findFarmerInvitationById(invitationId)
  if (userid !== invitation.userid) {
    throw new HttpError('Unauthorized', 401)
  }

  if (new Date(invitation.expiresat) <= new Date()) {
    throw new HttpError('Invitation Expired', 400)
  }

  const newUserCredentials: UpdateUser = {
    role: 'farmer',
    farm_id: invitation.farmid,
  }

  const farm = await Service.findCommunityFarmById(invitation.farmid)

  // update user credentials
  const updatedUser = await updateUser(userid, newUserCredentials)

  // delete farmer invitation
  await Service.deleteFarmerInvitation(invitation.id)

  await emitPushNotification(
    farm.farm_head,
    'Hello',
    `${updatedUser.username} accepted your invitation`
  )
}

export async function rejectFarmerApplication(
  invitationId: string,
  userid: string
) {
  const invitation = await Service.findFarmerInvitationById(invitationId)
  if (userid !== invitation.userid) {
    throw new HttpError('Unauthorized', 401)
  }

  await Service.deleteFarmerInvitation(invitation.id)
  const farm = await Service.findCommunityFarmById(invitation.farmid)

  const user = await findUser(userid)

  await emitPushNotification(
    farm.farm_head,
    'Hello',
    `${user.username} rejected your invitation`
  )
}

export async function cancelFarmerInvitation(
  invitationId: string,
  userid: string
) {
  const invitaion = await Service.findFarmerInvitationById(invitationId)

  if (!invitaion) throw new HttpError("Can't find invitation", 404)

  const user = await findUser(userid)

  if (invitaion.farmid !== user.farm_id) {
    throw new HttpError('Unauthorized', 401)
  }

  await Service.deleteFarmerInvitation(invitationId)
}

export async function viewFarmerInvitation(
  invitationId: string,
  userid: string
) {
  const invitaion = await Service.findFarmerInvitationDetails(invitationId)

  if (!invitaion) throw new HttpError('Invitation expired', 404)

  if (new Date(invitaion.expiresat) <= new Date()) {
    throw new HttpError('Invitation expired', 401)
  }

  if (invitaion.userid !== userid) {
    throw new HttpError('Unauthorized', 401)
  }

  return invitaion
}

export async function listFarmerInvitations(
  userid: string,
  perpage: number,
  offset: number
) {
  const user = await findUser(userid)

  const [data, total] = await Promise.all([
    Service.findFarmerInvitations(user.farm_id, perpage, offset),
    Service.getTotalFarmerInvitaions(user.farm_id),
  ])

  return { data, total }
}

export async function listCommunityFarmMembers(
  userid: string,
  perpage: number,
  offset: number,
  search: string
) {
  const user = await findUser(userid)

  const [data, total] = await Promise.all([
    Service.findCommunityFarmMembers(user.farm_id, perpage, offset, search),
    Service.getTotalFarmMembers(user.farm_id),
  ])

  for (const item of data) {
    item.avatar = getObjectUrl(item.avatar)
    delete item.password
  }

  return { data, total }
}

export async function updateCommunityFarm(
  userid: string,
  farm: UpdateCommunityFarmT,
  avatar: Express.Multer.File,
  cover_photo: Express.Multer.File
) {
  try {
    const user = await findUser(userid)

    const communityFarm = await Service.findCommunityFarmById(user.farm_id)
    if (!communityFarm) {
      throw new HttpError("Can't find farm", 404)
    }

    const updatedCommunityFarm: UpdateCommunityFarm = {
      ...farm.body,
      avatar: avatar?.filename ? avatar?.filename : communityFarm.avatar,
      cover_photo: cover_photo?.filename
        ? cover_photo?.filename
        : communityFarm.cover_photo,
    }

    // var files = [avatar, cover_photo]

    // upload file to cloud
    if (avatar) {
      const stream: fs.ReadStream = await readFileAsStream(avatar.path)
      await uploadFile(stream, avatar.filename, avatar.mimetype)
    }

    if (cover_photo) {
      const stream: fs.ReadStream = await readFileAsStream(cover_photo.path)
      await uploadFile(stream, cover_photo.filename, cover_photo.mimetype)
    }

    const updatedFarm = await Service.updateCommunityFarm(
      user.farm_id,
      updatedCommunityFarm
    )

    if (updatedFarm.cover_photo !== communityFarm.cover_photo) {
      await deleteFileCloud(communityFarm.cover_photo)
    }

    if (updatedFarm.avatar !== communityFarm.avatar) {
      await deleteFileCloud(communityFarm.avatar)
    }

    if (avatar?.filename) {
      deleteFile(avatar.filename)
    }

    if (cover_photo?.filename) {
      deleteFile(cover_photo.filename)
    }

    return updatedFarm
  } catch (error) {
    if (avatar?.filename) {
      deleteFile(avatar.filename)
    }
    if (cover_photo?.filename) {
      deleteFile(cover_photo.filename)
    }

    dbErrorHandler(error)
  }
}

export async function archiveCommunityCrop(userid: string, cropid: string) {
  const user = await findUser(userid)

  const crop = await Service.findCommunityCropById(cropid)

  if (!crop) {
    throw new HttpError('Crop not found', 404)
  }

  if (crop.farm_id !== user.farm_id) {
    throw new HttpError('Unauthorized', 401)
  }

  await Service.archiveCommunityCrop(cropid)
}

export async function unArchiveCommunityCrop(userid: string, cropid: string) {
  const user = await findUser(userid)

  const crop = await Service.findCommunityCropById(cropid)

  if (!crop) {
    throw new HttpError('Crop not found', 404)
  }

  if (crop.farm_id !== user.farm_id) {
    throw new HttpError('Unauthorized', 401)
  }

  await Service.unArchiveCommunityCrop(cropid)
}

export async function listArchivedCommunityCrops(userid: string) {
  const user = await findUser(userid)

  const crops = await Service.findCommunityFarmCrops(user.farm_id, true)

  for (const crop of crops) {
    crop.image = getObjectUrl(crop.image)
  }

  return crops
}

export async function updateCrop(
  id: string,
  updateObject: UpdateCrop,
  file: Express.Multer.File
) {
  try {
    const [foundCrop] = await Service.findCrop(id)

    if (!foundCrop) throw new HttpError('crop not found', 400)

    if (file?.filename) {
      await uploadFiles([file])
      await deleteFileCloud(foundCrop.image)
      deleteFile(file?.filename)
    }

    const updatedCrop = await Service.updateCrop(
      {
        ...updateObject,
        image: file?.filename ? file?.filename : foundCrop.image,
        updatedat: new Date(),
      },
      id
    )
    return updatedCrop
  } catch (error) {
    deleteFile(file?.filename)
    dbErrorHandler(error)
  }
}

export async function viewCropDetails(id: string) {
  const [crop] = await Service.findCrop(id)

  if (!crop) throw new HttpError('Crop not found', 404)

  return crop
}
