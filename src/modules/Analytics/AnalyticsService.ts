import { db } from '../../config/database'

export async function getLatestReport(farmid: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'c.id', 'cfc.crop_id')
    .select(({ eb }) => [
      'ccr.kilogram',
      'ccr.planted_qty',
      'c.name',
      'ccr.crop_id',
      eb
        .selectFrom('community_crop_reports as ccrp')
        .select(['planted_qty'])
        .whereRef('ccrp.id', '=', 'ccr.last_harvest_id')
        .as('previous_planted_qty'),
    ])
    .where('farmid', '=', farmid)
    .where('date_harvested', 'is not', null)
    .orderBy('ccr.createdat desc')
    .executeTakeFirst()
}

export async function getLastTwoReports(cropid: string, farmid: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'c.id', 'cfc.crop_id')
    .select(({ eb }) => [
      'ccr.kilogram',
      'ccr.planted_qty',
      'c.name',
      'ccr.crop_id',
      eb
        .selectFrom('community_crop_reports as ccrp')
        .select(['planted_qty'])
        .whereRef('ccrp.id', '=', 'ccr.last_harvest_id')
        .as('previous_planted_qty'),
    ])
    .where('ccr.crop_id', '=', cropid)
    .where('ccr.farmid', '=', farmid)
    .where('ccr.date_harvested', 'is not', null)
    .orderBy('ccr.createdat desc')
    .limit(2)
    .execute()
}
