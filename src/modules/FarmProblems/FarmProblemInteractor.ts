import { NewFarmProblem } from '../../types/DBTypes'
import HttpError from '../../utils/HttpError'
import * as Service from './FarmProblemService'

export async function upsertFarmProblem(
  problem: NewFarmProblem,
  materials: string[] | string
) {
  const data = await Service.upsertFarmProblem(problem, materials)
  return data
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
    Service.getTotalFarmProblems(),
  ])

  return { data, total }
}
