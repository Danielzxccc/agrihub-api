import {
  ApplicationAnswers,
  FarmMemberApplicationSchema,
  FarmQuestionSchema,
  HarvestedCropReportT,
  PlantedCropReportT,
} from '../../schema/CommunityFarmSchema'
import { getUserOrThrow } from '../../utils/findUser'
import { findCommunityFarmById, findCrop } from '../Farm/FarmService'
import { updateUser } from '../Users/UserService'
import HttpError from '../../utils/HttpError'
import * as Service from './CommunityService'
import { z } from 'zod'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { getObjectUrl, uploadFiles } from '../AWS-Bucket/UploadService'
import {
  CommunityCropReport,
  NewCommunityFarmReport,
  NewCommunityTask,
  NewFarmMemberApplication,
  UpdateCommunityFarmReport,
  UpdateCommunityTask,
} from '../../types/DBTypes'
import { deleteFile } from '../../utils/file'
import { emitPushNotification } from '../Notifications/NotificationInteractor'
import { deleteLocalFiles } from '../../utils/utils'
import {
  CommunityTasksStatus,
  CommunityTasksType,
  FarmMemberApplicationStatus,
} from 'kysely-codegen'
import {
  findCommunityFarmCrop,
  findCommunityReportById,
  insertCropReportImage,
} from '../Reports/ReportsService'

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

export async function checkExistingFarmerApplication(userid: string) {
  const user = await getUserOrThrow(userid)

  const application = await Service.findUserApplication(user.id)

  application.proof_selfie = getObjectUrl(application.proof_selfie)
  application.valid_id = getObjectUrl(application.valid_id)

  return application
}

// TODO: add option to farm head if their farm is public or private

type CreatePlantedReportType = {
  farmid: string
  userid: string
  report: PlantedCropReportT
  images: Express.Multer.File[]
}

export async function createPlantedReport({
  farmid,
  userid,
  report,
  images,
}: CreatePlantedReportType) {
  try {
    const user = await getUserOrThrow(userid)

    const communityFarm = await findCommunityFarmById(farmid)

    if (!communityFarm) {
      throw new HttpError('Community farm not found', 404)
    }

    if (communityFarm.id !== user.farm_id) {
      throw new HttpError('Unauthorized', 401)
    }

    const { crop_id, date_planted, planted_qty, task_id } = report.body
    // check if farm head
    const isFarmHead = user.role === 'farm_head'

    if (!isFarmHead && !task_id) {
      throw new HttpError(
        "Quick Reminder: Please submit reports only if you've been assigned the task. Thank you for your cooperation!",
        401
      )
    }
    //find task

    if (!isFarmHead) {
      const farmerTask = await Service.findPendingCommunityTask(task_id)

      if (!farmerTask) {
        throw new HttpError('Task not found', 404)
      }
      // compare if task equal to requester
      if (farmerTask.assigned_to !== user.id) {
        throw new HttpError(
          "Notice: This task isn't assigned to you. Thank you.",
          401
        )
      }

      if (farmerTask.task_type !== 'plant') {
        throw new HttpError(
          'Note: This task is designated for planting purposes only. Thank you for your understanding.',
          401
        )
      }
    }

    // update task to completed

    const crop = await findCommunityFarmCrop(crop_id as string)
    if (!crop) throw new HttpError("Can't find crop", 404)

    const [parent] = await findCrop(crop.crop_id)

    const reportObject: NewCommunityFarmReport = {
      farmid,
      userid,
      crop_id,
      date_planted: new Date(date_planted),
      planted_qty,
    }

    const data = await Service.createPlantedReport(reportObject)

    // update task
    if (task_id) {
      await Service.updateCommunityTask(task_id, {
        status: 'completed',
      })
    }

    if (images?.length) {
      const reportImages = images.map((item) => {
        return {
          imagesrc: item.filename,
          report_id: data.id,
          crop_name: parent.name,
        }
      })

      await insertCropReportImage(reportImages)
      await uploadFiles(images)

      deleteLocalFiles(images)
    }
    return data
  } catch (error) {
    deleteLocalFiles(images)
    dbErrorHandler(error)
  }
}

export type listPlantedCropReportsT = {
  farmid: string
  offset: number
  searchKey: string
  perpage: number
  month: string
  filterKey: string[] | string
  status: 'harvested' | 'planted'
}

export async function listPlantedCropReports(payload: listPlantedCropReportsT) {
  const [data, total] = await Promise.all([
    Service.listPlantedCropReports(payload),
    Service.getTotalPlantedReports(payload),
  ])

  return { data, total }
}

type CreateHarvestedReportType = {
  id: string
  userid: string
  report: HarvestedCropReportT
  images: Express.Multer.File[]
}

export async function createHarvestedReport({
  id,
  userid,
  report,
  images,
}: CreateHarvestedReportType) {
  try {
    const user = await getUserOrThrow(userid)

    const communityFarm = await findCommunityFarmById(user.farm_id)

    if (!communityFarm) {
      throw new HttpError('Community Farm not found', 404)
    }

    if (user.farm_id !== communityFarm.id) {
      throw new HttpError('Unauthorized', 401)
    }

    const reportData = await findCommunityReportById(id, user.farm_id)

    if (!reportData) {
      throw new HttpError('Report Not Found', 404)
    }

    if (reportData.date_harvested !== null) {
      throw new HttpError('This crop is already harvested', 400)
    }

    const isFarmHead = user.role === 'farm_head'

    const { task_id } = report.body
    if (!isFarmHead && !task_id) {
      throw new HttpError(
        "Quick Reminder: Please submit reports only if you've been assigned the task. Thank you for your cooperation!",
        401
      )
    }
    //find task

    if (!isFarmHead) {
      const farmerTask = await Service.findPendingCommunityTask(task_id)

      if (!farmerTask) {
        throw new HttpError('Task not found', 404)
      }
      // compare if task equal to requester
      if (farmerTask.assigned_to !== user.id) {
        throw new HttpError(
          "Notice: This task isn't assigned to you. Thank you.",
          401
        )
      }

      if (farmerTask.task_type !== 'harvest') {
        throw new HttpError(
          'Note: This task is designated for harvesting purposes only. Thank you for your understanding.',
          401
        )
      }
    }

    const reportPayload = report.body
    delete reportPayload.task_id

    const reportObject: UpdateCommunityFarmReport = {
      ...reportPayload,
      harvested_by: userid,
    }

    await Service.updateCropReport(id, reportObject)

    // update task
    if (task_id) {
      await Service.updateCommunityTask(task_id, {
        status: 'completed',
      })
    }

    if (images?.length) {
      const reportImages = images.map((item) => {
        return {
          imagesrc: item.filename,
          report_id: reportData.id,
          crop_name: reportData.crop_name,
        }
      })

      await insertCropReportImage(reportImages)
      await uploadFiles(images)

      deleteLocalFiles(images)
    }
  } catch (error) {
    deleteLocalFiles(images)
    dbErrorHandler(error)
  }
}

export type CreatePlantedCommunityTaskT = {
  farmid: string
  userid: string
  assigned_to: string
  crop_id: string
  due_date: string
  message?: string
}

export async function createPlantedCommunityTask({
  assigned_to,
  farmid,
  crop_id,
  due_date,
  message,
  userid,
}: CreatePlantedCommunityTaskT) {
  const user = await getUserOrThrow(assigned_to)

  const farmHead = await getUserOrThrow(userid)

  if (farmHead.farm_id !== farmid) {
    throw new HttpError('Unauthorized', 401)
  }

  const communityFarm = await findCommunityFarmById(farmid)

  if (!communityFarm) {
    throw new HttpError('Community Farm Not Found', 404)
  }

  if (communityFarm.id !== user.farm_id) {
    throw new HttpError('Unauthorized', 401)
  }

  const taskObject: NewCommunityTask = {
    crop_id,
    due_date,
    assigned_to,
    farmid,
    message,
    task_type: 'plant',
    action_message: `${user.firstname} ${user.lastname} has submitted a planting report.`,
  }

  const newTask = await Service.createCommunityTask(taskObject)

  //TODO: Add redirect path for frontend
  await emitPushNotification(
    assigned_to,
    'New Task Alert:',
    `The Farm Head has assigned you a planting report to submit. Please review and take action. Message: (${message})`
  )

  return newTask
}

type CreateHarvestTaskT = {
  farmid: string
  userid: string
  assigned_to: string
  report_id: string
  due_date: string
  message: string
}

export async function createHarvestTask({
  assigned_to,
  userid,
  farmid,
  due_date,
  message,
  report_id,
}: CreateHarvestTaskT) {
  const user = await getUserOrThrow(assigned_to)

  const farmHead = await getUserOrThrow(userid)

  if (farmHead.farm_id !== farmid) {
    throw new HttpError('Unauthorized', 401)
  }

  const communityFarm = await findCommunityFarmById(farmid)

  if (!communityFarm) {
    throw new HttpError('Community Farm Not Found', 404)
  }

  if (communityFarm.id !== user.farm_id) {
    throw new HttpError('Unauthorized', 401)
  }

  const isReportAlreadyAssigned = await Service.findHarvestingCommunityTask(
    report_id
  )

  if (isReportAlreadyAssigned) {
    throw new HttpError(
      `This task report has already been assigned to ${
        isReportAlreadyAssigned.assigned_to === assigned_to ? 'this' : 'another'
      } user.`,
      400
    )
  }

  const plantedReport = await findCommunityReportById(report_id, farmid)

  if (!plantedReport) {
    throw new HttpError('Report not found', 404)
  }

  if (plantedReport.date_harvested) {
    throw new HttpError(
      'This report is already submitted a harvested report',
      400
    )
  }

  const taskObject: NewCommunityTask = {
    farmid,
    assigned_to,
    report_id,
    due_date,
    task_type: 'harvest',
    status: 'pending',
    message,
  }

  const newHarvestTask = await Service.createCommunityTask(taskObject)

  await emitPushNotification(
    assigned_to,
    'New Task Alert:',
    `The Farm Head has assigned you a harvesting report to submit. Please review and take action. Message: (${message})`
  )

  return newHarvestTask
}

export type ListCommunityTasksT = {
  farmid: string
  filter: CommunityTasksStatus
  type: CommunityTasksType
  offset: number
  searchKey: string
  perpage: number
}

export async function listCommunityTasks(payload: ListCommunityTasksT) {
  const communityFarm = await findCommunityFarmById(payload.farmid)

  if (!communityFarm) {
    throw new HttpError('Community Farm Not Found', 404)
  }

  const [data, total] = await Promise.all([
    Service.listCommunityTasks(payload),
    Service.getTotalCommunityTasks(payload),
  ])

  return { data, total }
}

export async function deleteCommunityTask(userid: string, id: string) {
  const farmHead = await getUserOrThrow(userid)

  const task = await Service.findPendingCommunityTask(id)

  if (!task) {
    throw new HttpError('Community Task Not Found', 404)
  }

  if (farmHead.farm_id !== task.farmid) {
    throw new HttpError('Unauthorized', 401)
  }

  await Service.deleteCommunityTask(id)
}
