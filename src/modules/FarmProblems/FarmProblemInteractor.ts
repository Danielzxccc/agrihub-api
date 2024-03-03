import { promise } from 'zod'
import { SendReportProblemT } from '../../schema/FarmProblemSchema'
import { NewFarmProblem, UpdateFarmProblemReport } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import { emitPushNotification } from '../Notifications/NotificationInteractor'
import { findUser } from '../Users/UserService'
import * as Service from './FarmProblemService'

export async function upsertFarmProblem(
  problem: NewFarmProblem,
  materials: string[] | string
) {
  const data = await Service.upsertFarmProblem(problem, materials)

  const newProblem = data.newProblem

  if (!newProblem.common && data.material.length) {
    console.log('test fire condition')
    const uncommonProblems = await Service.findUncommonProblems(newProblem.id)
    console.log(uncommonProblems, 'TEST ARRAY UNCOMMON')
    const notificationPromises = uncommonProblems.map((item) =>
      emitPushNotification(
        item.userid,
        "New potential solutions to your farm's challenges.",
        'An admin has provided or modified learning materials or solutions for your specific problem.'
      )
    )
    await Promise.all(notificationPromises)
  }

  return newProblem
}

export async function viewFarmProblem(id: string) {
  const data = await Service.viewFarmProblem(id)
  if (!data) throw new HttpError('Problem not found', 404)
  return data
}

export async function archiveProblem(id: string) {
  await Service.updateProblem(id, { is_archived: true })
}

export async function unarchiveProblem(id: string) {
  await Service.updateProblem(id, { is_archived: false })
}

export async function deleteFarmProblemMaterial(id: string) {
  const deletedData = await Service.deleteFarmProblemMaterial(id)
  if (!deletedData) throw new HttpError('Problem Not found', 404)
}

export async function listFarmProblems(
  offset: number,
  perpage: number,
  searchKey: string,
  filterKey: boolean
) {
  const [data, total] = await Promise.all([
    Service.findFarmProblems(offset, perpage, searchKey, filterKey),
    Service.getTotalFarmProblems(filterKey),
  ])

  return { data, total }
}

export async function listArchivedFarmProblems(
  offset: number,
  perpage: number,
  searchKey: string,
  filterKey: boolean
) {
  const [data, total] = await Promise.all([
    Service.findArchivedFarmProblems(offset, perpage, searchKey, filterKey),
    Service.getTotalFarmArchivedProblems(),
  ])

  return { data, total }
}

export async function sendFarmProblemReport(
  userid: string,
  report: SendReportProblemT
) {
  const user = await findUser(userid)

  const reportObject = report.body
  let problem_id: string | undefined

  if (reportObject.is_other) {
    const { description, problem } = reportObject
    const newFarmProblem = await Service.upsertFarmProblem({
      description,
      problem,
      common: false,
    })
    problem_id = newFarmProblem.newProblem.id
  }

  const farmProblemReport = await Service.createReportedProblem({
    community_farm: user.farm_id,
    userid: user.id,
    problem_id: problem_id ? problem_id : reportObject.problem_id,
  })

  if (reportObject.is_other) {
    await emitPushNotification(
      'admin',
      'A new uncommon problem has been reported.',
      `Farm Head ${user.firstname} ${user.lastname} has submitted a new uncommon farm/crop problem requiring attention.`
    )
  }

  return farmProblemReport
}

export async function listCommunityFarmProblems(
  userid: string,
  offset: number,
  perpage: number,
  searchKey: string,
  filterKey: 'pending' | 'resolved'
) {
  const { farm_id } = await findUser(userid)

  const [data, total] = await Promise.all([
    Service.findCommunityFarmProblems(
      farm_id,
      offset,
      perpage,
      searchKey,
      filterKey
    ),
    Service.getTotalCommunityFarmProblems(farm_id, filterKey),
  ])

  return { data, total }
}

export async function markProblemAsResolved(
  id: string,
  is_helpful: boolean,
  feedback: string
) {
  const updateObject: UpdateFarmProblemReport = {
    date_solved: new Date(),
    is_helpful,
    feedback,
    status: 'resolved',
  }

  const resolvedProblem = await Service.updateReportedProblem(id, updateObject)

  if (!resolvedProblem) throw new HttpError('problem not found', 404)
}
