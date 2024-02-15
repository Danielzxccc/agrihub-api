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

export const NewLearningCredits = z.object({
  body: z.object({
    name: z.string(),
    title: z.string(),
  }),
})

export const NewLearningTags = z.object({
  body: z.object({
    tags: z.union([z.array(z.string()), z.string()]),
  }),
})

export const ListDraftLearningMaterials = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
  }),
})

export type NewLearningMaterialT = z.infer<typeof NewLearningMaterial>
export type NewLearningResourceT = z.infer<typeof NewLearningResource>
