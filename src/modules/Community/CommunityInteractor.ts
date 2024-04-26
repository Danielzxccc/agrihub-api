import { FarmQuestionSchema } from '../../schema/CommunityFarmSchema'
import { getUserOrThrow } from '../../utils/findUser'
import { findCommunityFarmById } from '../Farm/FarmService'
import { updateUser } from '../Users/UserService'
import HttpError from '../../utils/HttpError'
import * as Service from './CommunityService'

type CommunityFarmJoinRequest = {
  userid: string
  farmid: string
  //   requirement object
}

export async function joinCommunityFarm({
  userid,
  farmid,
}: CommunityFarmJoinRequest) {
  const user = await getUserOrThrow(userid)

  const communityFarm = await findCommunityFarmById(farmid)

  if (!communityFarm) {
    throw new HttpError('Community Farm not found', 404)
  }

  //logic for validation of farmer requirements upon joining

  //add community farm join request to database

  // emit push notification to farm head
}

type ListFarmerRequests = {
  farmid: string
  userid: string
}

export async function listFarmJoinRequest({
  farmid,
  userid,
}: ListFarmerRequests) {
  // verify if farm head is authorized for this data
  // query join requests via farmid with paginations
}

export async function viewFarmerJoinRequest(id: string) {
  // check if farm head is authorized to view that request
  //return request
}

type FarmerJoinRequest = {
  id: string
  userid: string
}

export async function acceptFarmerJoinRequest({
  id,
  userid,
}: FarmerJoinRequest) {
  // find farmer communty farm member request
  //update user to farmer and update farm id
  //send notification to requester
}

export async function rejectFarmerJoinRequest({
  id,
  userid,
}: FarmerJoinRequest) {
  // find farmer communty farm member request
  //update user to farmer and update farm id
  //send notification to requester
}

export async function createNewFarmQuestion(
  userid: string,
  { body: question }: FarmQuestionSchema
) {
  const user = await getUserOrThrow(userid)

  // check if farm exists
  const communityFarm = await findCommunityFarmById(user.farm_id)

  if (!communityFarm) {
    throw new HttpError('Community Farm Not Found', 404)
  }

  question.forEach((obj) => {
    obj.farmid = user.farm_id
  })

  //insert or upsert
  const data = await Service.createNewFarmQuestion(question)
}

export async function findFarmQuestions(farm_id: string) {
  const communityFarm = await findCommunityFarmById(farm_id)

  if (!communityFarm) {
    throw new HttpError('Community Farm Not Found', 404)
  }

  const data = await Service.findFarmQuestions(farm_id)

  return data
}

export async function deleteFarmQuestion(userid: string, id: string) {
  const user = await getUserOrThrow(userid)

  const question = await Service.findFarmQuestion(id)

  if (!question) {
    throw new HttpError('Question not found', 404)
  }

  if (user.farm_id !== question.farmid) {
    throw new HttpError('Unauthorized', 401)
  }

  const deletedQuestion = await Service.deleteFarmQuestion(question.id)

  if (!deletedQuestion) {
    throw new HttpError('Question Not Found', 404)
  }
}
