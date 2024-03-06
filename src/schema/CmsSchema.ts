import { z } from 'zod'

export const UpdateClientDetails = z.object({
  body: z.object({
    name: z.string(),
    logo: z.string(),
    email: z.string(),
    contact_number: z.string(),
    address: z.string(),
    mission: z.string(),
    vision: z.string(),
    socials: z
      .array(
        z
          .object({
            id: z.string().optional(),
            name: z.string(),
            link: z.string(),
          })
          .optional()
      )
      .optional(),
    partners: z
      .array(
        z
          .object({
            id: z.string().optional(),
            logo: z.string(),
            name: z.string(),
            description: z.string(),
          })
          .optional()
      )
      .optional(),
    members: z
      .array(
        z
          .object({
            id: z.string().optional(),
            name: z.string(),
            image: z.string().nullable(),
            position: z.string(),
            description: z.string().nullable(),
          })
          .optional()
      )
      .optional(),
  }),
})

export type ClientDetails = z.infer<typeof UpdateClientDetails>
