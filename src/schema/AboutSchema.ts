import { z } from 'zod'

export const UpdateAboutUs = z.object({
  body: z.object({
    about_us: z.string().optional(),
    city_commitment: z.string().optional(),
    president_message: z.string().optional(),
  }),
})

export type UpdateAboutUsT = z.infer<typeof UpdateAboutUs>
