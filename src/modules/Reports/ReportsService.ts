import { sql } from 'kysely'
import { db } from '../../config/database'
import { NewCommunityFarmReport, NewCropReportImage } from '../../types/DBTypes'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'

export async function insertCommunityCropReport(
  report: NewCommunityFarmReport
) {
  return await db
    .insertInto('community_crop_reports')
    .values(report)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function insertCropReportImage(image: NewCropReportImage) {
  return await db
    .insertInto('community_crop_reports_images')
    .values(image)
    .returningAll()
    .execute()
}

export async function findCommunityFarmCrop(id: string) {
  return await db
    .selectFrom('community_farms_crops')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function getHarvestedAndWitheredCrops(id: string) {
  return await db
    .selectFrom('community_farms_crops as cfc')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .leftJoin('community_crop_reports as ccr', 'cfc.id', 'ccr.crop_id')
    .select([
      'cfc.id as community_farms_crops_id',
      'cfc.farm_id',
      'cfc.crop_id',
      'c.name as crop_name',
      sql`COALESCE(SUM(ccr.harvested_qty), 0)`.as('total_harvested'),
      sql`COALESCE(SUM(ccr.withered_crops), 0)`.as('total_withered'),
    ])
    .where('cfc.farm_id', '=', id)
    .groupBy(['cfc.id', 'cfc.farm_id', 'cfc.crop_id', 'c.name'])
    .execute()
}

export async function getTotalHarvestedCrops(id: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn, val }) => [
      'ccr.crop_id',
      'c.name as crop_name',
      fn<string>('concat', [val(returnObjectUrl()), 'c.image']).as('image'),
      sql`SUM(ccr.harvested_qty)`.as('total_harvested'),
    ])
    .groupBy(['ccr.crop_id', 'c.name', 'c.image'])
    .where('ccr.farmid', '=', id)
    .execute()
}
