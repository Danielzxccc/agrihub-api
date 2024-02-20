import { NewSeedlingRequest, UpdateSeedlingRequest } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import { findCrop } from '../Farm/FarmService'
import { emitPushNotification } from '../Notifications/NotificationInteractor'
import { emitNotificationToAdmin } from '../Socket/SocketController'
import { findUser } from '../Users/UserService'
import * as Service from './FarmRequestService'

export async function createtSeedlingRequest(
  request: NewSeedlingRequest,
  id: string
) {
  const user = await findUser(id)

  const [crop] = await findCrop(String(request.crop_id))

  const checkRequests = await Service.findSeedlingRequest(user.farm_id, crop.id)

  if (checkRequests) {
    throw new HttpError(
      `You already have a pending request for ${crop.name} seedlings`,
      400
    )
  }

  if (!crop) {
    request.crop_id = null
  }

  const newSeedlingRequest = await Service.insertSeedlingRequest({
    ...request,
    farm_id: user.farm_id,
  })

  await emitPushNotification(
    'admin',
    'New Seedling Request',
    `Farm head ${user.firstname} ${user.lastname} requested ${crop.name} seedlings`
  )

  return newSeedlingRequest
}

export async function cancelSeedlingRequest(id: string, userid: string) {
  const user = await findUser(userid)

  const request = await Service.findSeedlingRequestById(id)

  if (user.farm_id !== request.farm_id) {
    throw new HttpError('Unauthorize', 401)
  }

  await Service.deleteSeedlingRequest(id)
}

export async function listSeedlingRequestByFarm(userid: string) {
  const user = await findUser(userid)

  const requests = await Service.findSeedlingRequestByFarm(user.farm_id)

  return requests
}

export async function listAllSeedlingRequests(
  offset: number,
  searchKey: string,
  perpage: number,
  filter: string
) {
  const [data, total] = await Promise.all([
    Service.findAllSeedlingRequest(offset, searchKey, perpage, filter),
    Service.getTotalSeedlingRequests(),
  ])

  return { data, total }
}

export async function acceptSeedlingRequest(
  id: string,
  request: UpdateSeedlingRequest
) {
  const findRequest = await Service.findSeedlingRequestById(id)

  if (!findRequest) {
    throw new HttpError('Request not found', 404)
  }

  const updateObject: UpdateSeedlingRequest = {
    ...request,
    status: 'accepted',
  }

  await Service.updateSeedlingRequest(id, updateObject)
}

export async function rejectSeedlingRequest(id: string) {
  const findRequest = await Service.findSeedlingRequestById(id)

  if (!findRequest) {
    throw new HttpError('Request not found', 404)
  }

  const updateObject: UpdateSeedlingRequest = {
    status: 'rejected',
  }

  await Service.updateSeedlingRequest(id, updateObject)
}
