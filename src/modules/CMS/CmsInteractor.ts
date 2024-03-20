import { UpdateAboutUsT } from '../../schema/AboutSchema'
import { ClientDetails } from '../../schema/CmsSchema'
import { NewUserFeedback, UpdateAboutUs } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { deleteFile } from '../../utils/file'
import {
  deleteFileCloud,
  uploadFile,
  uploadFiles,
} from '../AWS-Bucket/UploadService'
import * as Service from './CmsService'

export async function findClientDetails() {
  const data = await Service.findClientDetails()
  return data
}

export async function updateClientDetails(data: ClientDetails) {
  await Service.updateClientDetails(data)
}

export async function deleteClientSocial(id: string) {
  const deletedData = await Service.deleteClientSocial(id)
  if (!deletedData) throw new HttpError('Item not found', 404)
}

export async function deleteClientPartner(id: string) {
  const deletedData = await Service.deleteClientPartner(id)
  if (!deletedData) throw new HttpError('Item not found', 404)
  await deleteFileCloud(deletedData?.logo ?? '')
}

export async function deleteClientMember(id: string) {
  const deletedData = await Service.deleteClientMember(id)
  if (!deletedData) throw new HttpError('Item not found', 404)

  await deleteFileCloud(deletedData?.image ?? '')
}

export async function createUserFeedback(feedback: NewUserFeedback) {
  const newFeedBack = await Service.createUserFeedback(feedback)

  return newFeedBack
}

export async function listUserFeedbacks(
  offset: number,
  searchKey: string,
  perpage: number
) {
  const [data, total] = await Promise.all([
    Service.findUserFeedbacks(offset, searchKey, perpage),
    Service.getTotalUserFeedbacks(searchKey),
  ])

  return { data, total }
}

export async function viewUserFeedback(id: string) {
  const userFeedback = await Service.viewUserFeedback(id)
  if (!userFeedback) throw new HttpError('Not Found', 404)
  return userFeedback
}

export async function getVisionStatistics() {
  const stats = await Service.getVisionStatistics()
  if (!stats) throw new HttpError('Not Found', 404)

  const formattedStats = {
    community_farms: stats.community_farms,
    registered_farmer: stats.registered_farmer,
    forums_forums_answers: stats.forums_answers,
    total_resources: String(
      parseInt(stats.learning_materials) +
        parseInt(stats.events) +
        parseInt(stats.blogs)
    ),
  }

  return formattedStats
}

interface AboutUsPayload {
  banner: Express.Multer.File
  city_image: Express.Multer.File
  president_image: Express.Multer.File
  qcu_logo: Express.Multer.File
  agrihub_user_logo: Express.Multer.File
  data: UpdateAboutUsT
}

export async function updateAboutUs(data: AboutUsPayload) {
  try {
    const currentAboutUs = await Service.viewAboutUs()

    if (data?.banner) {
      await uploadFiles([data.banner])
      await deleteFileCloud(currentAboutUs.banner)
    }
    if (data?.city_image) {
      await uploadFiles([data.city_image])
      await deleteFileCloud(currentAboutUs.city_image)
    }
    if (data?.president_image) {
      await uploadFiles([data.president_image])
      await deleteFileCloud(currentAboutUs.president_image)
    }
    if (data?.qcu_logo) {
      await uploadFiles([data.qcu_logo])
      await deleteFileCloud(currentAboutUs.qcu_logo)
    }
    if (data?.agrihub_user_logo) {
      await uploadFiles([data.agrihub_user_logo])
      await deleteFileCloud(currentAboutUs.agrihub_user_logo)
    }

    const payload = data?.data?.body

    const updateObject: UpdateAboutUs = {
      banner: data?.banner?.filename
        ? data?.banner?.filename
        : currentAboutUs.banner,
      city_image: data?.city_image?.filename
        ? data?.city_image?.filename
        : currentAboutUs.city_image,
      president_image: data?.president_image?.filename
        ? data?.president_image?.filename
        : currentAboutUs.president_image,
      agrihub_user_logo: data?.agrihub_user_logo?.filename
        ? data?.agrihub_user_logo?.filename
        : currentAboutUs.agrihub_user_logo,
      qcu_logo: data?.qcu_logo?.filename
        ? data?.qcu_logo?.filename
        : currentAboutUs.qcu_logo,
      about_us: payload?.about_us ? payload?.about_us : currentAboutUs.about_us,
      city_commitment: payload?.city_commitment
        ? payload?.city_commitment
        : currentAboutUs.city_commitment,
      president_message: payload?.president_message
        ? payload?.president_message
        : currentAboutUs.president_message,
    }

    await Service.updateAboutUs(updateObject)

    if (data?.banner) {
      deleteFile(data.banner.filename)
    }
    if (data?.city_image) {
      deleteFile(data.city_image.filename)
    }
    if (data?.president_image) {
      deleteFile(data.president_image.filename)
    }
    if (data?.qcu_logo) {
      deleteFile(data.qcu_logo.filename)
    }
    if (data?.agrihub_user_logo) {
      deleteFile(data.agrihub_user_logo.filename)
    }
  } catch (error) {
    if (data?.banner) {
      deleteFile(data.banner.filename)
    }
    if (data?.city_image) {
      deleteFile(data.city_image.filename)
    }
    if (data?.president_image) {
      deleteFile(data.president_image.filename)
    }
    if (data?.qcu_logo) {
      deleteFile(data.qcu_logo.filename)
    }
    if (data?.agrihub_user_logo) {
      deleteFile(data.agrihub_user_logo.filename)
    }
    dbErrorHandler(error)
  }
}

export async function viewAboutUs() {
  const data = await Service.viewAboutUs()
  return data
}
