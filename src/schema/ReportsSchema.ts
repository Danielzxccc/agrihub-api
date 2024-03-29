import { z } from 'zod'

// add transform if there's an image input
export const NewCommunityCropReport = z.object({
  body: z.object({
    crop_id: z.string().optional(),
    is_other: z
      .string()
      .transform((arg) => Boolean(arg))
      .optional(),
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
    is_first_report: z
      .string()
      .transform((arg) => Boolean(arg))
      .optional()
      .default('true'),
  }),
})
export type NewCommunityCropReportT = z.infer<typeof NewCommunityCropReport>

export const CommunityCropReports = z.object({
  params: z.object({
    id: z.string(),
  }),
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    // filter: z.array(z.string()).optional().default([]),
    filter: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .default([]),
    sort: z.string().optional().default('date_harvested'),
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
