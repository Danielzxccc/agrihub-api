import { z } from 'zod'

export const FarmQuestion = z.object({
  body: z.array(
    z.object({
      id: z.string().optional(),
      farmid: z.string().optional(),
      question: z.string(),
    })
  ),
})

export const ApplicationAnswers = z.array(
  z.object({
    questionid: z.string(),
    applicationid: z.string().optional(),
    answer: z.string(),
  })
)

export type FarmQuestionSchema = z.infer<typeof FarmQuestion>

export const FarmMemberApplication = z.object({
  body: z.object({
    contact_person: z.string(),
    reason: z.string(),
    answer: z.string().optional(),
  }),
})
export type FarmMemberApplicationSchema = z.infer<typeof FarmMemberApplication>

export const ListFarmerApplications = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z
      .union([
        z.literal('pending'),
        z.literal('rejected'),
        z.literal('accepted'),
      ])
      .optional(),
  }),
})

export const UpdateFarmerApplicationStatus = z.object({
  body: z.object({
    status: z.union([z.literal('rejected'), z.literal('accepted')]),
    remarks: z.string().optional(),
  }),
})

export const PlantedCropReport = z.object({
  body: z.object({
    planted_qty: z.string(),
    date_planted: z.string(),
    crop_id: z.string(),
  }),
})

export type PlantedCropReportT = z.infer<typeof PlantedCropReport>

export const HarvestedCropReport = z.object({
  body: z.object({
    harvested_qty: z.string(),
    withered_crops: z.string(),
    date_harvested: z.string(),
    notes: z.string().optional(),
    kilogram: z.string(),
  }),
})

export type HarvestedCropReportT = z.infer<typeof HarvestedCropReport>

const monthRegex: RegExp = /^(1[0-2]|[1-9])?$/
export const CommunityCropReports = z.object({
  params: z.object({
    id: z.string(),
  }),
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    // filter: z.array(z.string()).optional().default([]),
    month: z
      .string()
      .optional()
      .default('')
      .refine((value) => monthRegex.test(value ?? ''), 'Please input (1-12)'),
    filter: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .default([]),
    status: z
      .union([z.literal('harvested'), z.literal('planted')])
      .default('planted'),
  }),
})
