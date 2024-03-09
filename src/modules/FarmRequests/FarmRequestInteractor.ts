import { NewSeedlingRequest, UpdateSeedlingRequest } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import { findCommunityFarmById, findCrop } from '../Farm/FarmService'
import { emitPushNotification } from '../Notifications/NotificationInteractor'
import { emitNotificationToAdmin } from '../Socket/SocketController'
import { findUser } from '../Users/UserService'
import * as Service from './FarmRequestService'

export async function createtSeedlingRequest(
  request: NewSeedlingRequest,
  id: string
) {
  const user = await findUser(id)

  const [crop] = await findCrop(String(request?.crop_id || '1'))

  if (!request?.other) {
    if (!crop) {
      throw new HttpError('crop not found', 404)
    }
  }

  const checkRequests = await Service.findSeedlingRequest(
    user.farm_id,
    crop?.id || '1'
  )

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
    `Farm head ${user.firstname} ${user.lastname} requested ${
      crop?.name ? crop?.name : request?.other
    } seedlings`
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
    Service.getTotalSeedlingRequests(searchKey, filter),
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

  const farm = await findCommunityFarmById(findRequest.farm_id)

  await emitPushNotification(
    farm.farm_head,
    'Request Accepted',
    `Your seedling request has been accepted`
  )

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

  const farm = await findCommunityFarmById(findRequest.farm_id)

  await emitPushNotification(
    farm.farm_head,
    'Request Accepted',
    `Your seedling request has been rejected`
  )

  await Service.updateSeedlingRequest(id, updateObject)
}

export async function listFarmRequestsCount() {
  const data = await Service.getFarmRequestsCount()

  return data
}
