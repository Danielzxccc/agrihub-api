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
import { getObjectUrl, uploadFiles } from '../AWS-Bucket/UploadService'
import { NewFarmMemberApplication } from '../../types/DBTypes'
import { deleteFile } from '../../utils/file'
import { emitPushNotification } from '../Notifications/NotificationInteractor'
import { deleteLocalFiles } from '../../utils/utils'
import { FarmMemberApplicationStatus } from 'kysely-codegen'

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

export type ListFarmerRequests = {
  farmid: string
  userid: string
  offset: number
  searchKey: string
  perpage: number
  filter?: FarmMemberApplicationStatus
}

export async function listFarmerApplications(payload: ListFarmerRequests) {
  // verify if farm head is authorized for this data
  const { farmid, userid } = payload
  const user = await getUserOrThrow(userid)

  const communityFarm = await findCommunityFarmById(farmid)

  if (!communityFarm) {
    throw new HttpError('Community Farm Not Found', 404)
  }

  if (user.farm_id !== communityFarm.id) {
    throw new HttpError('Unathorized', 401)
  }

  const [data, total] = await Promise.all([
    Service.listFarmerApplications(payload),
    Service.getTotalFarmerApplications(payload),
  ])

  return { data, total }
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

export async function findFarmerApplication(userid: string, id: string) {
  const farmHead = await getUserOrThrow(userid)

  const application = await Service.findFarmerApplication(id)

  if (!application) {
    throw new HttpError('Application Not Found', 404)
  }

  if (farmHead.farm_id !== application.farmid) {
    throw new HttpError('Unauthorized', 401)
  }

  application.proof_selfie = getObjectUrl(application.proof_selfie)
  application.valid_id = getObjectUrl(application.valid_id)

  return application
}

export async function updateApplicationStatus(
  id: string,
  status: FarmMemberApplicationStatus,
  remarks?: string
) {
  const findApplication = await Service.findFarmerApplication(id)
  if (!findApplication) {
    throw new HttpError('Application Not Found', 404)
  }
  const updatedApplication = await Service.updateFarmerApplication(id, {
    status,
    remarks: remarks ? remarks : null,
  })
  const communityFarm = await findCommunityFarmById(updatedApplication.farmid)

  if (updatedApplication.status === 'accepted') {
    await updateUser(updatedApplication.userid, {
      role: 'farmer',
      farm_id: updatedApplication.farmid,
    })

    await emitPushNotification(
      updatedApplication.userid,
      'Application Approved!',
      `Congratulations! You are now a proud member of ${communityFarm.farm_name} community farm! 🌱 Click here to discover your recently joined community farm more! 🌟`,
      `/community/my-community/${updatedApplication.farmid}`
    )
  } else {
    await emitPushNotification(
      updatedApplication.userid,
      'Application Rejected',
      `We regret to inform you that your farm application at ${
        communityFarm.farm_name
      } has not been accepted at this time. We appreciate your interest in joining our community, and we encourage you to keep exploring other opportunities. Remarks: [${
        updatedApplication.remarks ?? ''
      }]`
    )
  }
}

export async function cancelFarmerApplication(userid: string, id: string) {
  const user = await getUserOrThrow(userid)

  const application = await Service.findFarmerApplication(id)

  if (!application) {
    throw new HttpError('Application Not Found', 404)
  }

  if (user.id !== application.userid) {
    throw new HttpError('Unauthorized', 401)
  }

  await Service.deleteFarmerApplication(id)
}
