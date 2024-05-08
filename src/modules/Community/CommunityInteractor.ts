import {
  ApplicationAnswers,
  CreateCommunityEventT,
  FarmMemberApplicationSchema,
  FarmQuestionSchema,
  HarvestedCropReportT,
  PlantedCropReportT,
  UpdateCommunityEventT,
} from '../../schema/CommunityFarmSchema'
import { getUserOrThrow } from '../../utils/findUser'
import { findCommunityFarmById, findCrop } from '../Farm/FarmService'
import {
  findFarmMembersByFarmId,
  findUser,
  updateUser,
} from '../Users/UserService'
import HttpError from '../../utils/HttpError'
import * as Service from './CommunityService'
import { z } from 'zod'
import dbErrorHandler from '../../utils/dbErrorHandler'
import {
  deleteFileCloud,
  getObjectUrl,
  uploadFiles,
} from '../AWS-Bucket/UploadService'
import {
  CommunityCropReport,
  NewCommunityFarmReport,
  NewCommunityTask,
  NewFarmMemberApplication,
  UpdateCommunityEvent,
  UpdateCommunityFarmReport,
  UpdateCommunityTask,
} from '../../types/DBTypes'
import { deleteFile } from '../../utils/file'
import { emitPushNotification } from '../Notifications/NotificationInteractor'
import { deleteLocalFiles, formatTimestamp, formatUTC } from '../../utils/utils'
import {
  CommunityEventsType,
  CommunityTasksStatus,
  CommunityTasksType,
  EventEngagement,
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
    await emitPushNotification(
      communityFarm.farm_head,
      `Heads up! ${communityFarm.farm_name} has a new applicant!`,
      `Click here to see more about ${user.firstname} ${user.lastname} details.`,
      `/community/my-community/${farmid}/application/${user.username}/${data.id}`
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

  await deleteFileCloud(application.proof_selfie)
  await deleteFileCloud(application.valid_id)

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
        action_message: 'finished planting and reported accordingly',
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
  order: 'asc' | 'desc'
  previous_id: string
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

    const updatedReportData = await Service.updateCropReport(id, reportObject)

    // update task
    if (task_id) {
      await Service.updateCommunityTask(task_id, {
        status: 'completed',
        action_message: 'finished harvesting and reported accordingly',
      })
    }

    let insertedImages
    if (images?.length) {
      const reportImages = images.map((item) => {
        return {
          imagesrc: item.filename,
          report_id: reportData.id,
          crop_name: reportData.crop_name,
        }
      })

      insertedImages = await insertCropReportImage(reportImages)
      await uploadFiles(images)

      deleteLocalFiles(images)
    }

    if (reportData.isyield) {
      // CREATE NEW COPY OBJECT
      const newBatch: NewCommunityFarmReport = {
        batch: updatedReportData.date_harvested,
        last_harvest_id: updatedReportData.last_harvest_id
          ? updatedReportData.last_harvest_id
          : updatedReportData.id,
        planted_qty: 0,
        date_planted: updatedReportData.date_planted,
        crop_id: updatedReportData.crop_id,
        farmid: updatedReportData.farmid,
        userid,
      }

      const insertedNewBatch = await Service.createPlantedReport(newBatch)
      // INSERT NEW BATCH

      // COPY IMAGES
      if (images?.length) {
        const newImages = insertedImages.map((item) => ({
          ...item,
          id: undefined,
          report_id: insertedNewBatch.id,
        }))

        await insertCropReportImage(newImages)
      }
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
    throw new HttpError('Not a farm member', 401)
  }

  const taskObject: NewCommunityTask = {
    crop_id,
    due_date,
    assigned_to,
    farmid,
    message,
    task_type: 'plant',
  }

  const newTask = await Service.createCommunityTask(taskObject)

  await emitPushNotification(
    assigned_to,
    'New Task Alert:',
    `The Farm Head has assigned you a planting report to submit. Please review and take action. Message: (${message})`,
    `/community/task/${farmid}?sortBy=pending&type=plant`
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
    action_message: `${user.firstname} ${user.lastname} has submitted a planting report.`,
  }

  const newHarvestTask = await Service.createCommunityTask(taskObject)

  await emitPushNotification(
    assigned_to,
    'New Task Alert:',
    `The Farm Head has assigned you a harvesting report to submit. Please review and take action. Message: (${message})`,
    `/community/task/936975470650327041?sortBy=pending&type=harvest`
  )

  return newHarvestTask
}

export type ListCommunityTasksT = {
  farmid: string
  userid?: string
  filter: CommunityTasksStatus
  type: CommunityTasksType
  offset: number
  searchKey: string
  perpage: number
}

export async function listCommunityTasks(payload: ListCommunityTasksT) {
  if (payload?.userid) {
    await getUserOrThrow(payload.userid)
  }

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

export async function createCommunityEvent(
  event: CreateCommunityEventT,
  banner: Express.Multer.File
) {
  try {
    const { farmid } = event.body

    const communityFarm = await findCommunityFarmById(farmid)

    if (!communityFarm) {
      throw new HttpError('Community Farm Not Found', 404)
    }

    const payload = event.body
    const newTags =
      typeof event.body?.tags === 'string'
        ? event.body.tags
        : event.body.tags
        ? [...event.body.tags]
        : []
    delete payload.tags

    const data = await Service.createCommunityEvent(
      {
        ...payload,
        banner: banner.filename,
      },
      newTags
    )

    await uploadFiles([banner])

    deleteLocalFiles([banner])
    // notification service

    // TODO: add redirect path
    if (payload.type === 'public') {
      const tagsToSearch = Array.isArray(data.tags)
        ? data.tags.map((item) => item.tagid)
        : [data.tags.tagid]
      const selectedUsers = await Service.findUsersWithTags(tagsToSearch)

      const notificationObjects = selectedUsers.map((item) =>
        emitPushNotification(
          item.userid,
          'Alert! New Community Farm Event',
          `Hey there! We've got something special just for you: an exciting new event from ${communityFarm.farm_name}. Get ready to dive into ${event.body.title}`,
          `/community/my-community/${farmid}/event/${data.insertedEvent.id}`
        )
      )

      const farmMembers = await findFarmMembersByFarmId(
        farmid,
        communityFarm.farm_head
      )

      const farmMembersNotifications = farmMembers.map((item) =>
        emitPushNotification(
          item.id,
          'Alert! New Community Farm Event',
          `Hey! Quick heads up: There's a new event going on at the community farm. Take a look when you get a chance! ${payload.title}`,
          `/community/my-community/${farmid}/event/${data.insertedEvent.id}`
        )
      )

      await Promise.all(farmMembersNotifications)

      await Promise.all(notificationObjects)
    } else {
      const selectedUsers = await findFarmMembersByFarmId(
        farmid,
        communityFarm.farm_head
      )
      const notificationObjects = selectedUsers.map((item) =>
        emitPushNotification(
          item.id,
          'Alert! New Community Farm Event',
          `Hey! Quick heads up: There's a new event going on at the community farm. Take a look when you get a chance! ${payload.title}`,
          `/community/my-community/${farmid}/event/${data.insertedEvent.id}`
        )
      )

      await Promise.all(notificationObjects)
    }

    return data
  } catch (error) {
    deleteLocalFiles([banner])
    dbErrorHandler(error)
  }
}

export type ListCommunityEventsT = {
  farmid?: string
  userid: string
  type: CommunityEventsType
  offset: number
  searchKey: string
  perpage: number
  filter: 'upcoming' | 'previous'
}

export async function listCommunityEvents(payload: ListCommunityEventsT) {
  let isDataOwner = false
  if (payload?.farmid) {
    const communityFarm = await findCommunityFarmById(payload.farmid)
    if (!communityFarm) {
      throw new HttpError('Community Farm Not Found', 404)
    }

    if (payload?.userid) {
      const user = await getUserOrThrow(payload.userid)
      isDataOwner = user.farm_id === communityFarm.id
    }
  }

  const [data, total] = await Promise.all([
    Service.listCommunityEventsByFarm(payload, isDataOwner),
    Service.getTotalCommunityEventsByFarm(payload, isDataOwner),
  ])

  for (const date of data) {
    date.start_date = await formatUTC(date.start_date)
    date.end_date = await formatUTC(date.end_date)
  }

  return { data, total }
}

export async function deleteCommunityEvent(id: string, userid: string) {
  const user = await getUserOrThrow(userid)
  const communityEvent = await Service.findCommunityEvent(id)

  if (!communityEvent) {
    throw new HttpError('Event not found', 404)
  }

  if (communityEvent.farmid !== user.farm_id) {
    throw new HttpError('Unthorized', 401)
  }

  await Service.deleteCommunityEvent(id)
}

export async function updateCommunityEvent(
  id: string,
  event: UpdateCommunityEventT,
  banner: Express.Multer.File
) {
  try {
    const communityEvent = await Service.findCommunityEvent(id)

    if (!communityEvent) {
      throw new HttpError('Event not found', 404)
    }

    const payload = event.body
    const newTags =
      typeof event.body?.tags === 'string'
        ? event.body.tags
        : event.body.tags
        ? [...event.body.tags]
        : []
    delete payload.tags

    const findExistingTags = await Service.findCommunityEventTags(id)

    let deletedTags: string[] = []
    if (findExistingTags.length) {
      const existingTags = findExistingTags.map((item) => item.tagid)

      const tagsToCompare = newTags?.length ? newTags : []

      deletedTags = existingTags.filter(
        (element) => !tagsToCompare.includes(element)
      )
    }

    const data = await Service.updateCommunityEvent(
      id,
      {
        ...payload,
        banner: banner?.filename ? banner?.filename : communityEvent.banner,
      },
      newTags,
      deletedTags
    )

    if (banner?.filename) {
      await deleteFileCloud(communityEvent.banner ?? 'banner')
      await uploadFiles([banner])
      deleteLocalFiles([banner])
    }

    return data
  } catch (error) {
    if (banner?.filename) deleteLocalFiles([banner])
    dbErrorHandler(error)
  }
}

export async function viewCommunityEvent(userid: string, id: string) {
  const event = await Service.viewCommunityEvent(id, userid)

  if (!event) {
    throw new HttpError('Event Not Found', 404)
  }

  event.start_date = await formatUTC(event.start_date)
  event.end_date = await formatUTC(event.end_date)

  if (event.type === 'private') {
    const user = await getUserOrThrow(userid)

    if (user.farm_id !== event.farmid) {
      throw new HttpError('Unauthorized', 401)
    }

    return event
  }

  return event
}

export async function eventAction(
  eventid: string,
  userid: string,
  action: EventEngagement
) {
  const event = await Service.findCommunityEvent(eventid)

  if (!event) {
    throw new HttpError('Event Not found', 404)
  }

  await getUserOrThrow(userid)

  await Service.eventAction(eventid, userid, action)

  // await emitPushNotification(
  //   communityFarm.farm_head,
  //   `Alert: New User Activity on Your Event`,
  //   `${user.firstname} ${user.lastname} is ${action} to your event (${event.title}).`
  // )
}

export async function removeExistingCropReport(id: string, userid: string) {
  const user = await getUserOrThrow(userid)
  const cropReport = await findCommunityReportById(id, user.farm_id)

  if (!cropReport) {
    throw new HttpError('Report not found', 404)
  }

  if (cropReport.farmid !== user.farm_id) {
    throw new HttpError('Unauthorized', 404)
  }

  if (cropReport.date_harvested) {
    throw new HttpError('This crop is already harvested', 400)
  }

  await Service.deleteCommunityCropReport(id)
}

export async function deleteUserEngagement(id: string, userid: string) {
  await getUserOrThrow(userid)

  const deletedData = await Service.deleteUserEngagement(id)
  if (!deletedData) {
    throw new HttpError('Engagement not found', 404)
  }
}
