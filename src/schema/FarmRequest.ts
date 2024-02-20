import { z } from 'zod'

export const NewSeedlingRequest = z.object({
  body: z.object({
    crop_id: z.string(),
    other: z.string().optional(),
    quantity_request: z.number(),
    note: z.string().optional(),
  }),
})

export const ListSeedlingRequest = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z
      .union([
        z.literal('pending'),
        z.literal('accepted'),
        z.literal('rejected'),
        z.literal(''),
      ])
      .default(''),
  }),
})

export const AcceptSeedlingRequest = z.object({
  body: z.object({
    quantity_approve: z.number(),
    delivery_date: z.string(),
  }),
})
