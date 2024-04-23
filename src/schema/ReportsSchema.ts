import { query } from 'express'
import { number, z } from 'zod'

// add transform if there's an image input
export const NewCommunityCropReport = z.object({
  body: z
    .object({
      crop_id: z.string().optional(),
      is_other: z
        .string()
        .transform((arg) => Boolean(arg))
        .optional(),
      report_id: z.string().optional(),
      isyield: z
        .string()
        .transform((arg) => Boolean(arg))
        .optional(),
      c_name: z.string().optional(),
      planted_qty: z.string().transform((arg) => Number(arg)),
      harvested_qty: z.string().transform((arg) => Number(arg)),
      withered_crops: z.string().transform((arg) => Number(arg)),
      date_planted: z.string(),
      date_harvested: z.string(),
      notes: z.string().optional(),
      kilogram: z
        .string()
        .transform((arg) => Number(arg))
        .optional(),
      is_first_report: z
        .string()
        .transform((arg) => Boolean(arg))
        .optional()
        .default('true'),
    })
    .refine(
      (data) => {
        if (data.is_other && !data.report_id) {
          return false
        }
        return true
      },
      {
        message:
          "Accepted by field is required when status is 'accepted' and forwarded to field is required when status is 'forwarded'",
        path: ['status'], // You can specify the path where the error will be shown
      }
    ),
})
export type NewCommunityCropReportT = z.infer<typeof NewCommunityCropReport>

const monthRegex: RegExp = /^(1[0-2]|[1-9])?$/
export const CommunityCropReports = z.object({
  params: z.object({
    id: z.string(),
  }),
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    // filter: z.array(z.string()).optional().default([]),
    month: z
      .string()
      .optional()
      .default('')
      .refine((value) => monthRegex.test(value ?? ''), 'Please input (1-12)'),
    filter: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .default([]),
    order: z
      .union([z.literal('desc'), z.literal('asc')])
      .optional()
      .default('desc'),
  }),
})

export const InactiveFarmQuery = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
  }),
})

export const FilterWitheredHarvested = z.object({
  query: z.object({
    year: z
      .string()
      .transform((arg) => Number(arg))
      .optional(),
    start: z
      .string()
      .transform((arg) => Number(arg))
      .optional(),
    end: z
      .string()
      .transform((arg) => Number(arg))
      .optional(),
  }),
})

export const GetHarvestRanking = z.object({
  query: z.object({
    order: z.union([z.literal('asc'), z.literal('desc')]).optional(),
  }),
})

export const GetHarvestDistribution = z.object({
  query: z.object({
    month: z.string().transform((arg) => Number(arg)),
    limit: z
      .string()
      .transform((arg) => Number(arg))
      .optional()
      .default('50'),
  }),
})

export const AnalyticsMonthQuery = z.object({
  query: z.object({
    month: z
      .string()
      .transform((arg) => Number(arg))
      .optional(),
    limit: z
      .string()
      .transform((arg) => Number(arg))
      .optional()
      .default('50'),
  }),
})

export const DistrictQuery = z.object({
  query: z.object({
    district: z
      .union([
        z.literal('District 1'),
        z.literal('District 2'),
        z.literal('District 3'),
        z.literal('District 4'),
        z.literal('District 5'),
        z.literal('District 6'),
      ])
      .default('District 1'),
    limit: z
      .string()
      .transform((arg) => Number(arg))
      .optional()
      .default('50'),
  }),
})

const DistrictOptions = z
  .union([
    z.literal('District 1'),
    z.literal('District 2'),
    z.literal('District 3'),
    z.literal('District 4'),
    z.literal('District 5'),
    z.literal('District 6'),
  ])
  .default('District 1')

export type DistrictType = z.infer<typeof DistrictOptions>
