import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import {
  Crop,
  NewCommunityFarm,
  NewCommunityFarmCrop,
  NewCommunityFarmImage,
  NewCrop,
  NewCropReport,
  NewFarm,
  NewFarmApplication,
  NewFarmerInvitation,
  NewSubFarm,
  UpdateCommunityFarm,
  UpdateCrop,
  UpdateFarmApplication,
  UpdateFarmerInvitation,
} from '../../types/DBTypes'
import { FarmApplicationStatus } from 'kysely-codegen'
import { sql } from 'kysely'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'

export async function findFarm(id: string) {
  return await db
    .selectFrom('farms')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findSubFarm(id: string) {
  return await db
    .selectFrom('sub_farms')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findSubFarmByHead(id: string) {
  return await db
    .selectFrom('sub_farms')
    .selectAll()
    .where('farm_head', '=', id)
    .executeTakeFirst()
}

export async function getTotalCount() {
  return await db
    .selectFrom('farms')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirst()
}
export async function listFarms(
  offset: number,
  searchQuery: string,
  perpage: number
) {
  let query = db.selectFrom('farms').selectAll()
  if (searchQuery.length)
    query = query.where('farms.name', 'ilike', `${searchQuery}%`)

  return await query.limit(perpage).offset(offset).execute()
}

export async function findAllCrops(is_archived = false) {
  return await db
    .selectFrom('crops')
    .selectAll()
    .where('is_other', '=', false)
    .where('is_archived', '=', is_archived)
    .execute()
}

export async function archiveCrop(id: string) {
  return await db
    .updateTable('crops')
    .set({ is_archived: true })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function unarchiveCrop(id: string) {
  return await db
    .updateTable('crops')
    .set({ is_archived: false })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function getTotalCrops() {
  return await db
    .selectFrom('crops')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirst()
}

export async function viewFarm(id: string) {
  return await db
    .selectFrom('farms')
    .leftJoin('sub_farms', 'farms.id', 'sub_farms.farmid')
    .select(({ fn, eb }) => [
      'farms.id',
      'farms.name',
      'location',
      'size',
      'farms.farm_head',
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select(['avatar', 'username', 'id'])
          .whereRef('farms.farm_head', '=', 'users.id')
      ).as('farm_head'),
      'district',
      'createdat',
      'updatedat',
      fn.count<number>('sub_farms.id').as('registered_subfarms'),
    ])
    .where('farms.id', '=', id)
    .groupBy('farms.id')
    .executeTakeFirst()
}

export async function createFarm(farm: NewFarm) {
  return await db
    .insertInto('farms')
    .values(farm)
    .returningAll()
    .executeTakeFirst()
}

export async function createSubFarm(subFarm: NewSubFarm) {
  return await db
    .insertInto('sub_farms')
    .values(subFarm)
    .returningAll()
    .executeTakeFirst()
}

export async function viewSubFarm(id: string, searchByHead?: boolean) {
  let query = db.selectFrom('sub_farms').select((eb) => [
    'sub_farms.id',
    'sub_farms.name',
    jsonObjectFrom(
      eb
        .selectFrom('farms')
        .select([
          'avatar',
          'cover_photo',
          'createdat',
          'description',
          'district',
          sql<string>`CAST(id AS TEXT)`.as('id'),
          'location',
          'name',
          'size',
          'updatedat',
        ])
        .whereRef('sub_farms.farmid', '=', 'farms.id')
    ).as('farm'),
  ])

  if (searchByHead) {
    query = query.where('farm_head', '=', id)
  } else {
    query = query.where('id', '=', id)
  }

  return await query.executeTakeFirstOrThrow()
}

export async function findMember(id: string) {
  return await db
    .selectFrom('farm_members')
    .selectAll()
    .where('userid', '=', id)
    .executeTakeFirst()
}

// crops
export async function createCrop(crop: NewCrop) {
  return await db
    .insertInto('crops')
    .values(crop)
    .returningAll()
    .executeTakeFirst()
}

export async function findCrop(id: string) {
  return await db.selectFrom('crops').selectAll().where('id', '=', id).execute()
}

export async function findCropByName(name: string) {
  return await db
    .selectFrom('crops')
    .selectAll()
    .where('name', '=', name)
    .executeTakeFirst()
}

export async function listCrops(): Promise<Crop[]> {
  return await db
    .selectFrom('crops')
    .selectAll()
    .where('is_other', '=', false)
    .where('is_archived', '=', false)
    .execute()
}

export async function updateCrop(crop: UpdateCrop, id: string) {
  return await db
    .updateTable('crops')
    .set(crop)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function createCropReport(crop: NewCropReport) {
  return await db
    .insertInto('crop_reports')
    .values(crop)
    .returningAll()
    .executeTakeFirst()
}

export async function listCropReports(farmid: string, isHarvested = false) {
  return await db
    .selectFrom('crop_reports')
    .selectAll()
    .where('farmid', '=', farmid)
    .where('isharvested', '=', isHarvested)
    .execute()
}

export async function createFarmApplication(application: NewFarmApplication) {
  return await db
    .insertInto('farm_applications')
    .values(application)
    .returningAll()
    .executeTakeFirst()
}

export async function updateFarmApplication(
  id: string,
  applicant: UpdateFarmApplication
) {
  return await db
    .updateTable('farm_applications')
    .set({ ...applicant, updatedat: sql`CURRENT_TIMESTAMP` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findFarmApplications(
  offset: number,
  filterKey: FarmApplicationStatus,
  searchKey: string,
  perpage: number
) {
  let query = db.selectFrom('farm_applications').select(({ eb }) => [
    'id',
    'farm_name',
    'farm_size',
    'district',
    'location',
    'proof',
    'farm_actual_images',
    'id_type',
    'valid_id',
    'selfie',
    'status',
    sql<string>`CAST(createdat AS TEXT)`.as('createdat'),
    sql<string>`CAST(updatedat AS TEXT)`.as('updatedat'),
    jsonObjectFrom(
      eb
        .selectFrom('users')
        .select(({ eb }) => [
          sql<string>`CAST(id AS TEXT)`.as('id'),
          'username',
          'avatar',
          'email',
          'firstname',
          'lastname',
        ])
        .whereRef('users.id', '=', 'farm_applications.applicant')
    ).as('applicant'),
  ])

  if (filterKey) query = query.where('status', '=', filterKey)

  if (searchKey.length) {
    query = query.where('farm_name', 'ilike', `%${searchKey}%`)
  }

  query = query.orderBy('updatedat desc')
  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalFarmApplications(
  filterKey: FarmApplicationStatus,
  searchKey: string
) {
  let query = db
    .selectFrom('farm_applications')
    .select(({ fn }) => [fn.count<number>('id').as('count')])

  if (filterKey) {
    query = query.where('status', '=', filterKey)
  }

  if (searchKey.length) {
    query = query.where('farm_name', 'ilike', `%${searchKey}%`)
  }

  return await query.executeTakeFirst()
}

export async function findOneFarmApplication(id: string) {
  return await db
    .selectFrom('farm_applications')
    .select(({ eb }) => [
      'id',
      'farm_name',
      'farm_size',
      'district',
      'location',
      'proof',
      'farm_actual_images',
      'id_type',
      'valid_id',
      'selfie',
      'status',
      sql<string>`CAST(createdat AS TEXT)`.as('createdat'),
      sql<string>`CAST(updatedat AS TEXT)`.as('updatedat'),
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select(({ eb }) => [
            sql<string>`CAST(id AS TEXT)`.as('id'),
            'username',
            'avatar',
            'email',
            'firstname',
            'lastname',
          ])
          .whereRef('users.id', '=', 'farm_applications.applicant')
      ).as('applicant'),
    ])
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findExistingApplication(userid: string) {
  return await db
    .selectFrom('farm_applications')
    .selectAll()
    .where('applicant', '=', userid)
    .where('status', '=', 'pending')
    .executeTakeFirst()
}

export async function deleteFarmApplicaiton(id: string) {
  return await db.deleteFrom('farm_applications').where('id', '=', id).execute()
}

export async function createNewCommunityFarm(farm: NewCommunityFarm) {
  return await db
    .insertInto('community_farms')
    .values(farm)
    .returningAll()
    .executeTakeFirst()
}

export async function findCommunityFarmById(id: string) {
  return await db
    .selectFrom('community_farms')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findCommunityFarmByName(name: string) {
  return await db
    .selectFrom('community_farms')
    .selectAll()
    .where('farm_name', '=', name)
    .executeTakeFirst()
}

export async function insertCommunityFarmCrop(crop: NewCommunityFarmCrop) {
  return await db
    .insertInto('community_farms_crops')
    .values(crop)
    .returningAll()
    .executeTakeFirst()
}

export async function findCommunityFarmCrops(id: string, is_archived = false) {
  return await db
    .selectFrom('community_farms_crops')
    .leftJoin('crops', 'community_farms_crops.crop_id', 'crops.id')
    .select(({ val, fn }) => [
      'community_farms_crops.id',
      'community_farms_crops.updatedat',
      'community_farms_crops.createdat',
      'crops.name',
      'crops.description',
      'crops.image',
      'crops.seedling_season',
      'crops.planting_season',
      'crops.harvest_season',
      'crops.isyield',
      'crops.growth_span',
    ])
    .where('community_farms_crops.farm_id', '=', id)
    .where('community_farms_crops.is_archived', '=', is_archived)
    .execute()
}

export async function insertCommunityFarmImage(image: NewCommunityFarmImage[]) {
  return await db
    .insertInto('community_farms_gallery')
    .values(image)
    .returningAll()
    .execute()
}

export async function findCommunityFarmImages(id: string) {
  return await db
    .selectFrom('community_farms_gallery')
    .selectAll()
    .where('farm_id', '=', id)
    .execute()
}

export async function findOneCommunityFarmImage(id: string) {
  return await db
    .selectFrom('community_farms_gallery')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteCommunityFarmImage(id: string) {
  return await db
    .deleteFrom('community_farms_gallery')
    .where('id', '=', id)
    .execute()
}

export async function findAllCommunityFarms(
  perpage: number,
  offset: number,
  search: string,
  filter: string
) {
  let query = db.selectFrom('community_farms').selectAll()

  if (search.length) query = query.where('farm_name', 'ilike', `%${search}%`)
  if (filter.length) query = query.where('district', '=', filter)

  return await query
    .where('is_archived', '=', false)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalCommunityFarms(search: string, filter: string) {
  let query = db
    .selectFrom('community_farms')
    .select(({ fn }) => [fn.count<number>('id').as('count')])

  if (search.length) query = query.where('farm_name', 'ilike', `%${search}%`)
  if (filter.length) query = query.where('district', '=', filter)

  return await query.where('is_archived', '=', false).executeTakeFirst()
}

export async function findArchivedCommunityFarms(
  perpage: number,
  offset: number,
  search: string,
  filter: string
) {
  let query = db.selectFrom('community_farms').selectAll()

  if (search.length) query = query.where('farm_name', 'ilike', `${search}%`)
  if (filter.length) query = query.where('district', '=', filter)

  return await query
    .where('is_archived', '=', true)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalArchivedCommunityFarms(
  search: string,
  filter: string
) {
  let query = db
    .selectFrom('community_farms')
    .select(({ fn }) => [fn.count<number>('id').as('count')])

  if (search.length) query = query.where('farm_name', 'ilike', `${search}%`)
  if (filter.length) query = query.where('district', '=', filter)

  return await query.where('is_archived', '=', true).executeTakeFirst()
}

export async function archiveCommunityFarm(id: string) {
  return await db
    .updateTable('community_farms')
    .set({ is_archived: true })
    .where('id', '=', id)
    .execute()
}

export async function restoreCommunityFarm(id: string) {
  return await db
    .updateTable('community_farms')
    .set({ is_archived: false })
    .where('id', '=', id)
    .execute()
}

export async function insertFarmerInvitation(farm: NewFarmerInvitation) {
  return await db
    .insertInto('farmer_invitations')
    .values(farm)
    .returningAll()
    .executeTakeFirst()
}

export async function updateFarmerInvitation(
  invitationId: string,
  farm: UpdateFarmerInvitation
) {
  return await db
    .updateTable('farmer_invitations')
    .set({ ...farm, updatedat: sql`CURRENT_TIMESTAMP` })
    .where('id', '=', invitationId)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteFarmerInvitation(invitationId: string) {
  return await db
    .deleteFrom('farmer_invitations')
    .where('id', '=', invitationId)
    .returningAll()
    .executeTakeFirst()
}

export async function findFarmerInvitationByUser(
  userid: string,
  farmid: string
) {
  return await db
    .selectFrom('farmer_invitations')
    .selectAll()
    .where('userid', '=', userid)
    .where('farmid', '=', farmid)
    .executeTakeFirst()
}

export async function findFarmerInvitationById(id: string) {
  return await db
    .selectFrom('farmer_invitations')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findFarmerInvitationDetails(id: string) {
  return await db
    .selectFrom('farmer_invitations as fi')
    .leftJoin('community_farms as cf', 'fi.farmid', 'cf.id')
    .select(({ fn, val }) => [
      'fi.id',
      'fi.expiresat',
      'fi.createdat',
      'fi.updatedat',
      'fi.userid',
      'cf.farm_name',
      'cf.id as community_farm_id',
      fn<string>('concat', [val(returnObjectUrl()), 'cf.avatar']).as('avatar'),
    ])
    .where('fi.id', '=', id)
    .executeTakeFirst()
}

export async function findFarmerInvitations(
  farmid: string,
  perpage: number,
  offset: number,
  search?: string
) {
  let query = db
    .selectFrom('farmer_invitations as fi')
    .leftJoin('users as u', 'fi.userid', 'u.id')
    .select(({ fn, val }) => [
      'fi.id',
      'u.firstname',
      'u.lastname',
      fn<string>('concat', [val(returnObjectUrl()), 'u.avatar']).as('avatar'),
      'u.email',
      'u.id as userid',
    ])

  return await query
    .where('fi.farmid', '=', farmid)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalFarmerInvitaions(farmid: string) {
  return await db
    .selectFrom('farmer_invitations')
    .select(({ fn }) => [fn.count('id').as('count')])
    .where('farmid', '=', farmid)
    .executeTakeFirst()
}

export async function findCommunityFarmMembers(
  farmid: string,
  perpage: number,
  offset: number,
  search: string
) {
  let query = db.selectFrom('users as u').selectAll()

  if (search.length) {
    query = query.where((eb) =>
      eb.or([
        eb('u.firstname', 'ilike', `${search}%`),
        eb('u.lastname', 'ilike', `${search}%`),
        eb('u.username', 'ilike', `${search}%`),
      ])
    )
  }

  return await query
    .where('u.farm_id', '=', farmid)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalFarmMembers(farmid: string) {
  return await db
    .selectFrom('users as u')
    .select(({ fn }) => [fn.count<number>('u.id').as('count')])
    .where('u.farm_id', '=', farmid)
    .executeTakeFirst()
}

export async function updateCommunityFarm(
  id: string,
  farm: UpdateCommunityFarm
) {
  return await db
    .updateTable('community_farms')
    .set({ ...farm, updatedat: sql`CURRENT_TIMESTAMP` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findCommunityCropById(id: string) {
  return await db
    .selectFrom('community_farms_crops')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function archiveCommunityCrop(id: string) {
  return await db
    .updateTable('community_farms_crops')
    .set({ is_archived: true })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function unArchiveCommunityCrop(id: string) {
  return await db
    .updateTable('community_farms_crops')
    .set({ is_archived: false })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function setMemberAsFarmHead(id: string) {
  return await db
    .updateTable('users')
    .set({ role: 'farm_head' })
    .where('id', '=', id)
    .returningAll()
    .execute()
}

export async function setFarmerHeadAsFarmer(id: string) {
  return await db
    .updateTable('users')
    .set({ role: 'farmer' })
    .where('id', '=', id)
    .returningAll()
    .execute()
}
