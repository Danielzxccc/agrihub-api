import { sql } from 'kysely'
import { db } from '../../config/database'
import { NewCommunityFarmReport, NewCropReportImage } from '../../types/DBTypes'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

export async function insertCommunityCropReport(
  report: NewCommunityFarmReport
) {
  return await db
    .insertInto('community_crop_reports')
    .values(report)
    .returningAll()
    .executeTakeFirstOrThrow()
}

export async function findCommunityReportById(id: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn, val, eb }) => [
      'ccr.id',
      'c.name as crop_name',
      'ccr.date_planted',
      'ccr.date_harvested',
      'ccr.harvested_qty',
      'ccr.withered_crops',
      'ccr.farmid',
      fn<string>('concat', [val(returnObjectUrl()), 'c.image']).as('image'),
      jsonArrayFrom(
        eb
          .selectFrom('community_crop_reports_images as ccri')
          .select(({ fn }) => [
            fn<string>('concat', [val(returnObjectUrl()), 'ccri.imagesrc']).as(
              'image'
            ),
          ])
          .whereRef('ccri.crop_name', '=', 'c.name')
      ).as('images'),
    ])
    .groupBy([
      'ccr.id',
      'c.name',
      'c.image',
      'ccr.date_planted',
      'ccr.date_harvested',
      'ccr.harvested_qty',
      'ccr.withered_crops',
    ])
    .where('ccr.id', '=', id)
    .where('ccr.is_archived', '=', false)
    .executeTakeFirst()
}

export async function findCommunityReports(
  id: string,
  offset: number,
  filterKey: string[] | string,
  searchKey: string,
  perpage: number,
  sortBy: string
) {
  let query = db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn, val }) => [
      'ccr.id as crop_id',
      'c.name as crop_name',
      'ccr.date_planted',
      'ccr.date_harvested',
      'ccr.harvested_qty',
      'ccr.withered_crops',
      fn<string>('concat', [val(returnObjectUrl()), 'c.image']).as('image'),
    ])
    .groupBy([
      'ccr.id',
      'c.name',
      'c.image',
      'ccr.date_planted',
      'ccr.date_harvested',
      'ccr.harvested_qty',
      'ccr.withered_crops',
    ])
    .where('ccr.farmid', '=', id)
    .where('ccr.is_archived', '=', false)

  if (filterKey.length) {
    if (typeof filterKey === 'string') {
      query = query.where('c.name', 'ilike', `${filterKey}%`)
    } else {
      query = query.where((eb) =>
        eb.or(filterKey.map((item) => eb('c.name', 'ilike', `${item}%`)))
      )
    }
  }

  if (searchKey.length) {
    query = query.where('c.name', 'ilike', `${searchKey}%`)
  }

  query = query.orderBy('ccr.date_harvested', 'desc')
  // if (sortBy.length) {
  //   query = query.orderBy('ccr.date_harvested', 'asc')
  // }
  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalReportCount(farmid: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .select(({ fn }) => [fn.count<number>('ccr.id').as('count')])
    .where('ccr.farmid', '=', farmid)
    .executeTakeFirst()
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
    .where('ccr.is_archived', '=', false)
    .execute()
}

export async function getTotalPlantedQuantity(farmid: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select([
      'c.name as crop_name',
      sql`COALESCE(SUM(ccr.planted_qty), 0)`.as('planted_quantity'),
    ])
    .groupBy(['ccr.crop_id', 'c.name'])
    .where('ccr.farmid', '=', farmid)
    .where('ccr.is_archived', '=', false)
    .execute()
}

export async function getTotalHarvestEachMonth(farmid: string) {
  return await db.executeQuery(
    sql`
      SELECT
        COALESCE(SUM(CASE WHEN month = 1 THEN total_harvested_qty END), 0) AS January,
        COALESCE(SUM(CASE WHEN month = 2 THEN total_harvested_qty END), 0) AS February,
        COALESCE(SUM(CASE WHEN month = 3 THEN total_harvested_qty END), 0) AS March,
        COALESCE(SUM(CASE WHEN month = 4 THEN total_harvested_qty END), 0) AS April,
        COALESCE(SUM(CASE WHEN month = 5 THEN total_harvested_qty END), 0) AS May,
        COALESCE(SUM(CASE WHEN month = 6 THEN total_harvested_qty END), 0) AS June,
        COALESCE(SUM(CASE WHEN month = 7 THEN total_harvested_qty END), 0) AS July,
        COALESCE(SUM(CASE WHEN month = 8 THEN total_harvested_qty END), 0) AS August,
        COALESCE(SUM(CASE WHEN month = 9 THEN total_harvested_qty END), 0) AS September,
        COALESCE(SUM(CASE WHEN month = 10 THEN total_harvested_qty END), 0) AS October,
        COALESCE(SUM(CASE WHEN month = 11 THEN total_harvested_qty END), 0) AS November,
        COALESCE(SUM(CASE WHEN month = 12 THEN total_harvested_qty END), 0) AS December
        FROM (
            SELECT
                EXTRACT(MONTH FROM date_harvested) AS month,
                EXTRACT(YEAR FROM date_harvested) AS year,
                SUM(harvested_qty) AS total_harvested_qty
            FROM
                community_crop_reports
            WHERE
                date_harvested IS NOT NULL
            AND
                farmid = ${farmid}
            GROUP BY
                year, month
        ) AS source
        GROUP BY
            year
        ORDER BY
            year;
      `.compile(db)
  )
}

export async function getAllHarvestedAndWitheredCrops() {
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
    .groupBy(['cfc.id', 'cfc.farm_id', 'cfc.crop_id', 'c.name'])
    .execute()
}

export async function getCropStatistics(name: string, farmid: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn, val, eb }) => [
      'ccr.crop_id',
      'c.name as crop_name',
      'c.description',
      fn<string>('concat', [val(returnObjectUrl()), 'c.image']).as('image'),
      fn.count<number>('ccr.id').as('report_count'),
      'c.growth_span',
      'c.seedling_season',
      'c.planting_season',
      'c.harvest_season',
      sql`COALESCE(SUM(ccr.planted_qty), 0)`.as('planted_quantity'),
      sql`COALESCE(SUM(ccr.harvested_qty), 0)`.as('total_harvested'),
      sql`COALESCE(SUM(ccr.withered_crops), 0)`.as('total_withered'),
      sql`ROUND(SUM(ccr.harvested_qty - COALESCE(ccr.withered_crops, 0)), 1)`.as(
        'net_yield'
      ),
      sql`ROUND(SUM(harvested_qty) / SUM(planted_qty), 2)`.as('crop_yield'),
      sql`((ROUND(SUM(harvested_qty) / SUM(planted_qty), 2)) + (ROUND(SUM(ccr.harvested_qty - COALESCE(ccr.withered_crops, 0)), 1))) - COALESCE(SUM(ccr.withered_crops), 0)`.as(
        'performance_score'
      ),
      jsonArrayFrom(
        eb
          .selectFrom('community_crop_reports_images as ccri')
          .select(({ fn }) => [
            fn<string>('concat', [val(returnObjectUrl()), 'ccri.imagesrc']).as(
              'image'
            ),
          ])
          .whereRef('ccri.crop_name', '=', 'c.name')
      ).as('images'),
    ])
    .groupBy([
      'ccr.crop_id',
      'c.name',
      'c.image',
      'c.description',
      'c.growth_span',
      'c.seedling_season',
      'c.planting_season',
      'c.harvest_season',
    ])
    .where('c.name', '=', name)
    .where('ccr.farmid', '=', farmid)
    .where('ccr.is_archived', '=', false)
    .executeTakeFirst()
}

export async function findLeastPerformantCrops(id: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select([
      'c.name as plant',
      sql`CASE WHEN c.isyield THEN 1 ELSE 0 END`.as('type'),
      sql`COALESCE(SUM(ccr.planted_qty), 0)`.as('planted_qty'),
      sql`COALESCE(SUM(ccr.harvested_qty), 0)`.as('harvested_qty'),
      sql`COALESCE(SUM(ccr.withered_crops), 0)`.as('withered_crops'),
      sql`ROUND(SUM(ccr.harvested_qty - COALESCE(ccr.withered_crops, 0)), 1)`.as(
        'net_yield'
      ),
      sql`ROUND(SUM(harvested_qty) / SUM(planted_qty), 2)`.as('crop_yield'),
      sql`((ROUND(SUM(harvested_qty) / SUM(planted_qty), 2)) + (ROUND(SUM(ccr.harvested_qty - COALESCE(ccr.withered_crops, 0)), 1))) - COALESCE(SUM(ccr.withered_crops), 0)`.as(
        'performance_score'
      ),
    ])
    .groupBy([
      'ccr.crop_id',
      'c.name',
      'c.image',
      'c.description',
      'c.growth_span',
      'c.seedling_season',
      'c.planting_season',
      'c.harvest_season',
      'c.isyield',
    ])
    .where('ccr.farmid', '=', id)
    .where('ccr.is_archived', '=', false)
    .orderBy('performance_score', 'asc')
    .execute()
}

/**
 *
 * @param id report id
 */
export async function archiveCommunityCropReport(id: string) {
  return await db
    .updateTable('community_crop_reports')
    .set({ is_archived: true })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function getGrowthHarvestStats(id: string) {
  return await db
    .selectFrom('crops as c')
    .select([
      'c.name as crop_name',
      sql`ROUND(AVG(ccr.harvested_qty), 2)`.as('avg_harvest_qty'),
      sql`ROUND(AVG(ccr.date_harvested - ccr.date_planted), 2)`.as(
        'avg_growth_span'
      ),
    ])
    .leftJoin('community_farms_crops as cfc', 'c.id', 'cfc.crop_id')
    .leftJoin('community_crop_reports as ccr', 'cfc.id', 'ccr.crop_id')
    .groupBy(['c.name'])
    .where('ccr.date_planted', 'is not', null)
    .where('ccr.date_harvested', 'is not', null)
    .where('ccr.farmid', '=', id)
    .execute()
}

export async function getAverageGrowthRate(farmid: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select([
      'c.name as plant',
      sql`CASE WHEN c.isyield THEN 1 ELSE 0 END`.as('type'),
      sql`COALESCE(SUM(ccr.planted_qty), 0)`.as('planted_qty'),
      sql`COALESCE(SUM(ccr.harvested_qty), 0)`.as('harvested_qty'),
      sql`COALESCE(SUM(ccr.withered_crops), 0)`.as('withered_crops'),
      sql`ROUND(SUM(ccr.harvested_qty - COALESCE(ccr.withered_crops, 0)), 1)`.as(
        'net_yield'
      ),
      sql`ROUND(SUM(harvested_qty) / SUM(planted_qty), 2)`.as('crop_yield'),
    ])
    .groupBy([
      'ccr.crop_id',
      'ccr.createdat',
      'c.name',
      'c.image',
      'c.description',
      'c.growth_span',
      'c.seedling_season',
      'c.planting_season',
      'c.harvest_season',
      'c.isyield',
    ])
    .where('ccr.farmid', '=', farmid)
    .orderBy('ccr.createdat desc')
    .execute()
}

export async function getTotalWitheredHarvestEachMonth(
  year: number,
  start: number,
  end: number
) {
  return await db.executeQuery(
    sql`
      SELECT
        COALESCE(SUM(CASE WHEN month = 1 THEN total_harvested_qty END), 0) AS January,
        COALESCE(SUM(CASE WHEN month = 1 THEN total_withered_qty END), 0) AS January_w,
        COALESCE(SUM(CASE WHEN month = 2 THEN total_harvested_qty END), 0) AS February,
        COALESCE(SUM(CASE WHEN month = 2 THEN total_withered_qty END), 0) AS February_w,
        COALESCE(SUM(CASE WHEN month = 3 THEN total_harvested_qty END), 0) AS March,
        COALESCE(SUM(CASE WHEN month = 3 THEN total_withered_qty END), 0) AS March_w,
        COALESCE(SUM(CASE WHEN month = 4 THEN total_harvested_qty END), 0) AS April,
        COALESCE(SUM(CASE WHEN month = 4 THEN total_withered_qty END), 0) AS April_w,
        COALESCE(SUM(CASE WHEN month = 5 THEN total_harvested_qty END), 0) AS May,
        COALESCE(SUM(CASE WHEN month = 5 THEN total_withered_qty END), 0) AS May_w,
        COALESCE(SUM(CASE WHEN month = 6 THEN total_harvested_qty END), 0) AS June,
        COALESCE(SUM(CASE WHEN month = 6 THEN total_withered_qty END), 0) AS June_w,
        COALESCE(SUM(CASE WHEN month = 7 THEN total_harvested_qty END), 0) AS July,
        COALESCE(SUM(CASE WHEN month = 7 THEN total_withered_qty END), 0) AS July_w,
        COALESCE(SUM(CASE WHEN month = 8 THEN total_harvested_qty END), 0) AS August,
        COALESCE(SUM(CASE WHEN month = 8 THEN total_withered_qty END), 0) AS August_w,
        COALESCE(SUM(CASE WHEN month = 9 THEN total_harvested_qty END), 0) AS September,
        COALESCE(SUM(CASE WHEN month = 9 THEN total_withered_qty END), 0) AS September_w,
        COALESCE(SUM(CASE WHEN month = 10 THEN total_harvested_qty END), 0) AS October,
        COALESCE(SUM(CASE WHEN month = 10 THEN total_withered_qty END), 0) AS October_w,
        COALESCE(SUM(CASE WHEN month = 11 THEN total_harvested_qty END), 0) AS November,
        COALESCE(SUM(CASE WHEN month = 11 THEN total_withered_qty END), 0) AS November_w,
        COALESCE(SUM(CASE WHEN month = 12 THEN total_harvested_qty END), 0) AS December,
        COALESCE(SUM(CASE WHEN month = 12 THEN total_withered_qty END), 0) AS December_w
        FROM (
            SELECT
                EXTRACT(MONTH FROM date_harvested) AS month,
                EXTRACT(YEAR FROM date_harvested) AS year,
                SUM(harvested_qty) AS total_harvested_qty,
                SUM(withered_crops) AS total_withered_qty
            FROM
                community_crop_reports
            WHERE
                date_harvested IS NOT NULL 
                AND
                EXTRACT(YEAR FROM date_harvested) = ${String(year)}
                AND
                EXTRACT(MONTH FROM date_harvested) BETWEEN ${String(
                  start
                )} AND ${String(end)}
            GROUP BY
                year, month
        ) AS source
        GROUP BY
            year
        ORDER BY
            year;
      `.compile(db)
  )
}

export async function getFavouriteCrops() {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn, val }) => [
      'ccr.crop_id',
      'c.name as crop_name',
      fn<string>('concat', [val(returnObjectUrl()), 'c.image']).as('image'),
      sql`SUM(ccr.planted_qty)`.as('total_planted'),
      sql`SUM(ccr.harvested_qty)`.as('total_harvested'),
      sql`SUM(ccr.withered_crops)`.as('total_withered'),
    ])
    .groupBy(['ccr.crop_id', 'ccr.planted_qty', 'c.name', 'c.image'])
    .where('ccr.is_archived', '=', false)
    .where('c.is_other', '=', false)
    .orderBy('total_planted desc')
    .limit(5)
    .execute()
}

export async function getLowestGrowthRates() {
  return await db.executeQuery(
    sql`
        WITH GrowthRates AS (
          SELECT 
              cf.id AS farm_id,
              AVG(
                  CASE 
                      WHEN crops.isyield THEN 
                          (cr.harvested_qty::numeric / NULLIF(cr.harvested_qty + cr.withered_crops, 0)) * 100
                      ELSE 
                          (cr.harvested_qty::numeric / NULLIF(cr.planted_qty, 0)) * 100
                  END
              ) AS avg_growth_rate
          FROM 
              community_farms cf
          JOIN 
              community_crop_reports cr ON cf.id = cr.farmid
          JOIN 
              community_farms_crops cfc ON cf.id = cfc.farm_id
          JOIN 
              crops ON cfc.crop_id = crops.id
          WHERE 
              NOT cr.is_archived
          GROUP BY 
              cf.id
      )
      SELECT 
          cf.id AS farm_id,
          CONCAT(${returnObjectUrl()}, cf.avatar) AS avatar,
          cf.farm_name,
          gr.avg_growth_rate
      FROM 
          community_farms cf
      JOIN 
          GrowthRates gr ON cf.id = gr.farm_id
      ORDER BY 
          gr.avg_growth_rate ASC
      LIMIT 
          5;
  `.compile(db)
  )
}
