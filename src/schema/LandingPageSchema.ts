import { z } from 'zod'

export const UpdateLanding = z.object({
  body: z.object({
    cta_header: z.string().optional(),
    cta_description: z.string().optional(),
    approach: z.string().optional(),
  }),
})

export const UpdateApproach = z.object({
  body: z.object({
    id: z.string().optional(),
    icon: z.string().optional(),
    title: z.string().optional().default(''),
    description: z.string().optional().default(''),
  }),
})

export const AddImage = z.object({
  body: z.object({
    landing_id: z
      .string({ required_error: 'id required' })
      .optional()
      .default('1'),
    index: z
      .string()
      .transform((arg) => Number(arg))
      .optional()
      .default('0'),
  }),
  file: z.object({
    filename: z.string({ required_error: 'filename required' }),
  }),
})
