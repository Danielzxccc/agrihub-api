import { ToolRequestStatus } from 'kysely-codegen'
import {
  NewSeedlingRequest,
  NewToolRequest,
  UpdateSeedlingRequest,
  UpdateToolRequest,
} from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import { findCommunityFarmById, findCrop } from '../Farm/FarmService'
import { emitPushNotification } from '../Notifications/NotificationInteractor'
import { emitNotificationToAdmin } from '../Socket/SocketController'
import { findUser } from '../Users/UserService'
import * as Service from './FarmRequestService'
import { getToolRequestNotification } from '../../utils/utils'
import { CommunityFarms } from '../../schema/FarmSchema'

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

export async function listSeedlingRequestByFarm(
  id: string,
  offset: number,
  searchKey: string,
  perpage: number,
  filter: string
) {
  // const user = await findUser(userid)
  const communityFarm = await findCommunityFarmById(id)

  if (!communityFarm) throw new HttpError('Farm Details Not Found', 404)

  const [data, total] = await Promise.all([
    Service.findSeedlingRequestByFarm(id, offset, searchKey, perpage, filter),
    Service.getTotalSeedlingRequests(searchKey, filter, id),
  ])

  return { data, total }
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
    updatedat: new Date(),
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

export async function submitNewToolRequest(
  userid: string,
  request: NewToolRequest
) {
  const user = await findUser(userid)

  const newRequestObject: NewToolRequest = {
    ...request,
    farm_id: user.farm_id,
    accepted_by: [],
  }

  //check request threshold
  const toolRequests = await Service.findPendingToolRequestsByFarm(user.farm_id)

  if (toolRequests.length >= 3) {
    throw new HttpError('You already have 3 pending requests', 400)
  }

  const newToolRequest = await Service.createToolRequest(newRequestObject)

  return newToolRequest
}

export async function listToolRequests(
  offset: number,
  searchKey: string,
  perpage: number,
  filter: ToolRequestStatus,
  farmid?: string,
  userid?: string
) {
  if (userid) {
    const user = await findUser(userid)
    const isFarmHead = user.role === 'farm_head'
    const isDataOwner = user.farm_id === farmid

    if (isFarmHead && farmid === undefined) {
      throw new HttpError('Unathorized', 401)
    }

    if (isFarmHead && !isDataOwner) {
      throw new HttpError('Unathorized', 401)
    }
  }

  if (farmid) {
    const communityFarm = await findCommunityFarmById(farmid)

    if (!communityFarm) {
      throw new HttpError('Farm not found', 404)
    }
  }

  const [data, total] = await Promise.all([
    Service.findToolRequests(offset, searchKey, perpage, filter, farmid),
    Service.getTotalToolRequest(searchKey, filter, farmid),
  ])

  return { data, total }
}

export async function updateToolRequestStatus(
  id: string,
  request: UpdateToolRequest
) {
  const updatedToolRequest = await Service.updateToolRequest(id, {
    ...request,
    updatedat: new Date(),
  })

  if (!updatedToolRequest) {
    throw new HttpError('Tool Request Not Found', 404)
  }

  const communityFarm = await findCommunityFarmById(updatedToolRequest.farm_id)
  const findFarmHead = await findUser(communityFarm.farm_head)

  const { title, body } = getToolRequestNotification(
    updatedToolRequest.status,
    request
  )

  //TODO: add redirection if frontend is finished
  await emitPushNotification(findFarmHead.id, title, body)

  return updatedToolRequest
}
