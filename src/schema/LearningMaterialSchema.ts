import { z } from 'zod'

export const NewLearningMaterial = z.object({
  body: z.object({
    title: z.string(),
  }),
})

export const UpdateLearningMaterial = z.object({
  body: z.object({
    title: z.string(),
    content: z.string().optional(),
    type: z.string().optional(),
    language: z.string().optional(),
  }),
})

export const NewLearningResource = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    resource: z.string().optional(),
    type: z.string().optional(),
  }),
})

export type NewLearningMaterialT = z.infer<typeof NewLearningMaterial>
export type NewLearningResourceT = z.infer<typeof NewLearningResource>
