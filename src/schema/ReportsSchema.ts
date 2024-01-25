import { z } from 'zod'

// add transform if there's an image input
export const NewCommunityCropReport = z.object({
  body: z.object({
    crop_id: z.string(),
    planted_qty: z.string().transform((arg) => Number(arg)),
    harvested_qty: z.string().transform((arg) => Number(arg)),
    withered_crops: z.string().transform((arg) => Number(arg)),
    date_planted: z.string(),
    date_harvested: z.string(),
    notes: z.string().optional(),
  }),
})
