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

export async function findCommunityReportById(id: string, farm_id?: string) {
  return await db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn, val, eb }) => [
      'ccr.id',
      'cfc.id as cfc_id',
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
          .leftJoin(
            'community_crop_reports as ccrs',
            'ccrs.id',
            'ccri.report_id'
          )
          .leftJoin('community_farms as cfs', 'cfs.id', 'ccrs.farmid')
          .select(({ fn }) => [
            fn<string>('concat', [val(returnObjectUrl()), 'ccri.imagesrc']).as(
              'image'
            ),
          ])
          .whereRef('ccri.crop_name', '=', 'c.name')
          .whereRef('ccri.report_id', '=', 'ccr.id')
          .where((eb) => {
            if (farm_id) {
              return eb('cfs.id', '=', farm_id)
            }
          })
      ).as('images'),
    ])
    .groupBy([
      'ccr.id',
      'c.name',
      'cfc.id',
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
  sortBy: string,
  isExisting?: boolean
) {
  let query = db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn, val }) => [
      'ccr.id as crop_id',
      'cfc.id as cfc_id',
      'c.name as crop_name',
      'ccr.date_planted',
      'ccr.date_harvested',
      'ccr.harvested_qty',
      'ccr.withered_crops',
      fn<string>('concat', [val(returnObjectUrl()), 'c.image']).as('image'),
    ])
    .groupBy([
      'ccr.id',
      'cfc.id',
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

  if (isExisting) {
    query = query.where('ccr.is_first_report', '=', true)
  }
  // if (sortBy.length) {
  //   query = query.orderBy('ccr.date_harvested', 'asc')
  // }
  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalReportCount(
  farmid: string,
  filterKey: string[] | string,
  searchKey: string,
  isExisting?: boolean
) {
  let query = db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn }) => [fn.count<number>('ccr.id').as('count')])
    .where('ccr.farmid', '=', farmid)

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

  if (isExisting) {
    query = query.where('ccr.is_first_report', '=', true)
  }

  return await query.executeTakeFirst()
}

export async function insertCropReportImage(image: NewCropReportImage) {
  return await db
    .insertInto('community_crop_reports_images')
    .values(image)
    .returningAll()
    .execute()
}

export async function markReportAsInactive(id: string) {
  return await db
    .updateTable('community_crop_reports as ccr')
    .set({ is_first_report: false })
    .where('ccr.id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findCommunityFarmCrop(id: string) {
  return await db
    .selectFrom('community_farms_crops')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

// TODO: Date harvested filter

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

//TODO: crop filter
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
          .leftJoin(
            'community_crop_reports as ccrs',
            'ccrs.id',
            'ccri.report_id'
          )
          .leftJoin('community_farms as cfs', 'cfs.id', 'ccrs.farmid')
          .select(({ fn }) => [
            fn<string>('concat', [val(returnObjectUrl()), 'ccri.imagesrc']).as(
              'image'
            ),
          ])
          .whereRef('ccri.crop_name', '=', 'c.name')
          .where('cfs.id', '=', farmid)
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
      sql`ROUND(SUM(NULLIF(ccr.harvested_qty, 0)) / SUM(NULLIF(ccr.planted_qty, 0)), 2)`.as(
        'crop_yield'
      ),
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
    // .where(sql`EXTRACT(MONTH FROM date_harvested)`, "", )
    .limit(20)
    .orderBy('ccr.createdat desc')
    .execute()
}

// EXTRACT(MONTH FROM date_harvested) BETWEEN ${String(
//   start
// )} AND ${String(end)}

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
      'c.name as crop_name',
      fn<string>('concat', [val(returnObjectUrl()), 'c.image']).as('image'),
      sql`SUM(ccr.planted_qty)`.as('total_planted'),
      sql`SUM(ccr.harvested_qty)`.as('total_harvested'),
      sql`SUM(ccr.withered_crops)`.as('total_withered'),
    ])
    .groupBy(['crop_name', 'c.image'])
    .where('ccr.is_archived', '=', false)
    .where('c.is_other', '=', false)
    .orderBy('total_planted desc')
    .limit(5)
    .execute()
}

export async function getLowestGrowthRates(order: 'desc' | 'asc') {
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
          AND 
              cf.is_archived = false
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
        CASE WHEN ${order} = 'desc' THEN gr.avg_growth_rate END DESC,
        CASE WHEN ${order} = 'asc' THEN gr.avg_growth_rate END ASC
      LIMIT 
          5;
  `.compile(db)
  )
}

export async function getGrowthRatePerMonth(
  year: number,
  start: number,
  end: number
) {
  return await db.executeQuery(
    sql`
    SELECT
        COALESCE(AVG(CASE WHEN month_number = 1 THEN growth_rate END), 0) AS January,
        COALESCE(AVG(CASE WHEN month_number = 2 THEN growth_rate END), 0) AS February,
        COALESCE(AVG(CASE WHEN month_number = 3 THEN growth_rate END), 0) AS March,
        COALESCE(AVG(CASE WHEN month_number = 4 THEN growth_rate END), 0) AS April,
        COALESCE(AVG(CASE WHEN month_number = 5 THEN growth_rate END), 0) AS May,
        COALESCE(AVG(CASE WHEN month_number = 6 THEN growth_rate END), 0) AS June,
        COALESCE(AVG(CASE WHEN month_number = 7 THEN growth_rate END), 0) AS July,
        COALESCE(AVG(CASE WHEN month_number = 8 THEN growth_rate END), 0) AS August,
        COALESCE(AVG(CASE WHEN month_number = 9 THEN growth_rate END), 0) AS September,
        COALESCE(AVG(CASE WHEN month_number = 10 THEN growth_rate END), 0) AS October,
        COALESCE(AVG(CASE WHEN month_number = 11 THEN growth_rate END), 0) AS November,
        COALESCE(AVG(CASE WHEN month_number = 12 THEN growth_rate END), 0) AS December
    FROM (
        SELECT
            Months.month_number,
            EXTRACT(MONTH FROM cr.date_harvested) AS month,
            EXTRACT(YEAR FROM cr.date_harvested) AS year,
            CASE 
                WHEN c.isyield THEN 
                    (cr.harvested_qty::numeric / NULLIF(cr.harvested_qty + cr.withered_crops, 0)) * 100
                ELSE 
                    (cr.harvested_qty::numeric / NULLIF(cr.planted_qty, 0)) * 100
            END AS growth_rate
        FROM
            (
                SELECT generate_series(1, 12) AS month_number
            ) AS Months
        LEFT JOIN
            community_crop_reports cr ON Months.month_number = EXTRACT(MONTH FROM cr.date_harvested)
        LEFT JOIN
            community_farms_crops cfc ON cr.farmid = cfc.farm_id
        LEFT JOIN
            crops c ON cfc.crop_id = c.id
        WHERE
            cr.date_harvested IS NOT NULL
            AND
            EXTRACT(YEAR FROM cr.date_harvested) = ${String(year)}
            AND
            EXTRACT(MONTH FROM cr.date_harvested) BETWEEN ${String(
              start
            )} AND ${String(end)}
    ) AS source
    GROUP BY
        year
    ORDER BY
        year;
  `.compile(db)
  )
}

export async function getResourcesCount() {
  return await db
    .selectNoFrom((eb) => [
      eb
        .selectFrom('learning_materials')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'published')
        .as('learning_materials'),
      eb
        .selectFrom('events')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'published')
        .as('events'),
      eb
        .selectFrom('blogs')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'published')
        .as('blogs'),
    ])
    .executeTakeFirst()
}

export async function getResourcesCountDetails() {
  return await db
    .selectNoFrom((eb) => [
      eb
        .selectFrom('learning_materials')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'published')
        .as('all_learning_materials'),
      eb
        .selectFrom('learning_materials')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'draft')
        .as('draft_learning_material'),
      eb
        .selectFrom('learning_materials')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('is_archived', '=', true)
        .as('archived_learning_material'),

      eb
        .selectFrom('events')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('events'),
      eb
        .selectFrom('events')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('event_end', '>', new Date())
        .as('upcoming_events'),

      eb
        .selectFrom('blogs')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'published')
        .as('blogs'),
      eb
        .selectFrom('blogs')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'draft')
        .as('draft_blogs'),
      eb
        .selectFrom('blogs')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('is_archived', '=', true)
        .as('archived_blogs'),
    ])
    .executeTakeFirst()
}

export async function getTotalHarvestPerDistrict() {
  return await db.executeQuery(
    sql`
    SELECT
        all_districts.district_name,
        COALESCE(cf.total_farms, 0) AS total_farms,
        COALESCE(SUM(ccr.harvested_qty), 0) AS total_harvest
    FROM
        (
            SELECT 'District 1' AS district_name
            UNION ALL
            SELECT 'District 2'
            UNION ALL
            SELECT 'District 3'
            UNION ALL
            SELECT 'District 4'
            UNION ALL
            SELECT 'District 5'
            UNION ALL
            SELECT 'District 6'
            -- Add more districts here if needed
        ) AS all_districts
    LEFT JOIN
        (
            SELECT district, COUNT(*) AS total_farms 
            FROM community_farms 
            GROUP BY district
        ) AS cf ON all_districts.district_name = cf.district
    LEFT JOIN
        community_farms farms ON all_districts.district_name = farms.district
    LEFT JOIN
        community_crop_reports ccr ON farms.id = ccr.farmid
    GROUP BY
        all_districts.district_name, cf.total_farms
    ORDER BY
        all_districts.district_name;

  `.compile(db)
  )
}

export async function getFarmOverview() {
  return await db
    .selectNoFrom((eb) => [
      eb
        .selectFrom('farm_applications')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'pending')
        .as('pending_farm_applications'),
      eb
        .selectFrom('community_farms')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('accepted_requests'),
      eb
        .selectFrom('users')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where((eb) =>
          eb.or([
            eb('users.role', '=', 'farmer'),
            eb('users.role', '=', 'farm_head'),
          ])
        )
        .where('isbanned', '=', false)
        .as('total_farmers'),
    ])
    .executeTakeFirst()
}

export async function getForumOverview(
  year: number,
  start: number,
  end: number
) {
  return db.executeQuery(
    sql`
    WITH Months AS (
        SELECT generate_series(1, 12) AS month_number
    ),
    QuestionsPerMonth AS (
        SELECT
            EXTRACT(MONTH FROM f.createdat) AS month,
            COUNT(*) AS num_questions
        FROM
            forums f
        WHERE
            EXTRACT(YEAR FROM f.createdat) = ${String(year)}
        AND
            EXTRACT(MONTH FROM f.createdat) BETWEEN ${String(
              start
            )} and ${String(end)}
        GROUP BY
            EXTRACT(MONTH FROM f.createdat)
    ),
    AnswersPerMonth AS (
        SELECT
            EXTRACT(MONTH FROM fa.createdat) AS month,
            COUNT(*) AS num_answers
        FROM
            forums_answers fa
        WHERE
            EXTRACT(YEAR FROM fa.createdat) = ${String(year)}
        AND
            EXTRACT(MONTH FROM fa.createdat) BETWEEN ${String(
              start
            )} and ${String(end)}
        GROUP BY
            EXTRACT(MONTH FROM fa.createdat)
    )
    SELECT
        m.month_number AS month,
        COALESCE(qpm.num_questions, 0) AS num_questions,
        COALESCE(apm.num_answers, 0) AS num_answers
    FROM
        Months m
    LEFT JOIN
        QuestionsPerMonth qpm ON m.month_number = qpm.month
    LEFT JOIN
        AnswersPerMonth apm ON m.month_number = apm.month
    ORDER BY
        m.month_number;
  `.compile(db)
  )
}

export async function getForumsCount() {
  return await db
    .selectNoFrom((eb) => [
      eb
        .selectFrom('forums')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('forums'),
      eb
        .selectFrom('forums_answers')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('forums_answers'),
      eb
        .selectFrom('forums_tags')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('forums_tags'),
    ])
    .executeTakeFirst()
}

export async function getCommonListOverview() {
  return await db
    .selectNoFrom((eb) => [
      eb
        .selectFrom('farm_applications')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'pending')
        .as('pending_farm_applications'),

      eb
        .selectFrom('community_farms')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('community_farms'),

      eb
        .selectFrom('seedling_requests')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('seedling_requests'),

      eb
        .selectFrom('seedling_requests')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'pending')
        .as('pending_seedling_requests'),

      eb
        .selectFrom('user_feedbacks')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('user_feedbacks'),

      eb
        .selectFrom('user_feedbacks')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('is_read', '=', false)
        .as('unread_user_feedbacks'),
    ])
    .executeTakeFirst()
}

export async function getAnalyticsOverviewPieChart() {
  return await db
    .selectNoFrom((eb) => [
      eb
        .selectFrom('seedling_requests')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('seedling_requests'),

      eb
        .selectFrom('seedling_requests')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'pending')
        .as('pending_seedling_requests'),

      eb
        .selectFrom('reported_problems')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'resolved')
        .as('solved_farm_problems'),

      eb
        .selectFrom('reported_problems')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'pending')
        .as('pending_farm_problems'),
    ])
    .executeTakeFirst()
}

export async function getUserFeedbackOverview() {
  return await db
    .selectFrom('user_feedbacks')
    .select(({ fn }) => [
      fn
        .count<number>('id')
        .filterWhere('rating', '=', '5')
        .as('very_satisfied'),
      fn.count<number>('id').filterWhere('rating', '=', '4').as('satisfied'),
      fn.count<number>('id').filterWhere('rating', '=', '3').as('neutral'),
      fn.count<number>('id').filterWhere('rating', '=', '2').as('dissatisfied'),
      fn
        .count<number>('id')
        .filterWhere('rating', '=', '1')
        .as('very_dissatisfied'),
    ])
    .executeTakeFirst()
}

export async function getFarmHarvestDistribution(month: number, limit: number) {
  return db.executeQuery(
    sql`
    WITH monthly_harvest AS (
    SELECT 
        SUM(harvested_qty) AS total_harvest,
        EXTRACT(MONTH FROM date_harvested) AS harvest_month
    FROM community_crop_reports
    WHERE EXTRACT(MONTH FROM date_harvested) = ${month}
    GROUP BY harvest_month
    ),
    farm_harvest AS (
        SELECT 
            farmid,
            SUM(harvested_qty) AS farm_harvest_qty
        FROM community_crop_reports
        WHERE EXTRACT(MONTH FROM date_harvested) = ${month}
        GROUP BY farmid
    )
    SELECT 
        cf.farm_name,
        fh.farm_harvest_qty,
        ROUND((fh.farm_harvest_qty::numeric / mh.total_harvest) * 100, 2) AS percentage_distribution
    FROM 
        farm_harvest fh
    INNER JOIN community_farms cf ON fh.farmid = cf.id
    CROSS JOIN monthly_harvest mh
    ORDER BY percentage_distribution DESC
    LIMIT ${limit};
  `.compile(db)
  )
}

export async function getCropHarvestDistribution(month: number, limit: number) {
  return db.executeQuery(
    sql`
    WITH monthly_harvest AS (
        SELECT 
            cc.crop_id,
            c.name AS crop_name,
            SUM(cr.harvested_qty) AS total_harvested_qty
        FROM 
            community_crop_reports cr
        JOIN 
            community_farms_crops cc ON cr.crop_id = cc.id
        JOIN 
            crops c ON cc.crop_id = c.id
        WHERE 
            EXTRACT(MONTH FROM cr.date_harvested) = ${month}
        GROUP BY 
            cc.crop_id, c.name
    )
    SELECT 
        crop_id,
        crop_name,
        total_harvested_qty,
        (total_harvested_qty / SUM(total_harvested_qty) OVER ()) * 100 AS percentage_distribution
    FROM 
        monthly_harvest
    ORDER BY 
        total_harvested_qty DESC
    LIMIT ${limit};
  `.compile(db)
  )
}
