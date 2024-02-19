import { z } from 'zod'

export const UpdateLanding = z.object({
  body: z.object({
    cta_header: z.string().optional(),
    cta_description: z.string().optional(),
    mision: z.string().optional(),
    approach: z.string().optional(),
    vision: z.string().optional(),
  }),
})

export const UpdateApproach = z.object({
  body: z.object({
    icon: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
})

export const AddImage = z.object({
  body: z.object({
    landing_id: z.string({ required_error: 'id required' }),
    index: z.string().optional(),
  }),
  file: z.object({
    filename: z.string({ required_error: 'filename required' }),
  }),
})
