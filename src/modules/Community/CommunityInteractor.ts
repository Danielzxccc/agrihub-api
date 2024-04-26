import {
  ApplicationAnswers,
  FarmMemberApplicationSchema,
  FarmQuestionSchema,
} from '../../schema/CommunityFarmSchema'
import { getUserOrThrow } from '../../utils/findUser'
import { findCommunityFarmById } from '../Farm/FarmService'
import { updateUser } from '../Users/UserService'
import HttpError from '../../utils/HttpError'
import * as Service from './CommunityService'
import { application, json } from 'express'
import { z } from 'zod'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { uploadFiles } from '../AWS-Bucket/UploadService'
import { NewFarmMemberApplication } from '../../types/DBTypes'
import { deleteFile } from '../../utils/file'
import { emitPushNotification } from '../Notifications/NotificationInteractor'
import { deleteLocalFiles } from '../../utils/utils'

/**
 * FARM APPLICATION LOGICS
 *
 */

type CommunityFarmJoinRequest = {
  userid: string
  farmid: string
  proof_selfie: Express.Multer.File
  valid_id: Express.Multer.File
  application: FarmMemberApplicationSchema
}

export async function joinCommunityFarm({
  userid,
  farmid,
  application,
  proof_selfie,
  valid_id,
}: CommunityFarmJoinRequest) {
  try {
    const user = await getUserOrThrow(userid)

    const communityFarm = await findCommunityFarmById(farmid)

    if (!communityFarm) {
      throw new HttpError('Community Farm not found', 404)
    }

    if (!proof_selfie || !valid_id) {
      throw new HttpError('Incomplete ID proof requirements provided.', 400)
    }

    //check if user has pending application to other farms
    const checkUserPendingApplication = await Service.findUserApplication(
      user.id
    )

    if (checkUserPendingApplication) {
      if (checkUserPendingApplication.farmid === farmid) {
        throw new HttpError(
          'You already have a pending application to this farm',
          400
        )
      }

      throw new HttpError(
        'In accordance with our policy, you are unable to apply to this farm while your application is pending with another farm.',
        400
      )
    }

    const { answer, contact_person, reason } = application.body

    //parse json object of user's answer
    let applicantAnswers: z.infer<typeof ApplicationAnswers>
    if (answer) {
      try {
        const rawAnswers = JSON.parse(answer)

        applicantAnswers = await ApplicationAnswers.parseAsync(rawAnswers)
      } catch (error) {
        console.log(error, 'PARSING ERROR LOG')
        throw new HttpError('Error parsing answers object', 400)
      }
    }

    //upload images
    const applicationImages = [proof_selfie, valid_id]

    await uploadFiles(applicationImages)

    const applicationRequestObject: NewFarmMemberApplication = {
      farmid,
      userid,
      contact_person,
      proof_selfie: proof_selfie.filename,
      valid_id: valid_id.filename,
      reason,
    }

    //add community farm join request to database
    const data = await Service.createFarmMemberApplication(
      applicationRequestObject
    )

    // add answers
    if (answer) {
      applicantAnswers.forEach((obj) => {
        obj.applicationid = data.id
      })

      await Service.createFarmMemberApplicationAnswers(applicantAnswers)
    }

    //delte local images
    deleteLocalFiles(applicationImages)

    // emit push notification to farm head
    // TODO: add redirect path
    await emitPushNotification(
      communityFarm.farm_head,
      `Heads up! ${communityFarm.farm_name} has a new applicant!`,
      `Click here to see more about ${user.firstname} ${user.lastname} details.`
    )

    return data
  } catch (error) {
    deleteLocalFiles([proof_selfie, valid_id])
    dbErrorHandler(error)
  }
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

/**
 *
 * FARM APPLICATION QUESTIONS
 *
 */

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
