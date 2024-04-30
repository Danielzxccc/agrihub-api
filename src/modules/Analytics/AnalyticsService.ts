import { db } from '../../config/database'

export async function getLatestReport(farmid: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'c.id', 'cfc.crop_id')
    .select(['ccr.kilogram', 'ccr.planted_qty', 'c.name', 'ccr.crop_id'])
    .where('farmid', '=', farmid)
    .where('date_harvested', 'is not', null)
    .executeTakeFirst()
}

export async function getLastTwoReports(cropid: string, farmid: string) {
  return await db
    .selectFrom('community_crop_reports')
    .selectAll()
    .where('crop_id', '=', cropid)
    .where('farmid', '=', farmid)
    .where('date_harvested', 'is not', null)
    .limit(2)
    .execute()
}
