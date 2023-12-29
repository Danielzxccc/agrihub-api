import { z } from 'zod'

export const UpdateAbout = z.object({
  body: z.object({
    bg_image: z.string().optional(),
    banner: z.string().optional(),
    partnership_img: z.string().optional(),
    qc_image: z.string().optional(),
    president_image: z.string().optional(),
    org_chart: z.string().optional(),
    description: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
    partnership: z.string().optional(),
    commitment: z.string().optional(),
    president_message: z.string().optional(),
  }),
})

export const AddImage = z.object({
  body: z.object({
    cms_id: z.string({ required_error: 'id required' }),
  }),
  file: z.object({
    filename: z.string({ required_error: 'filename required' }),
  }),
})
