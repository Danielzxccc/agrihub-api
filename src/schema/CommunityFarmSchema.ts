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
    task_id: z.string().optional(),
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
    task_id: z.string().optional(),
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

export const NewPlantTask = z.object({
  body: z.object({
    crop_id: z.string(),
    due_date: z.string(),
    message: z.string().optional(),
    assigned_to: z.string(),
  }),
})

export const NewHarvestTask = z.object({
  body: z.object({
    report_id: z.string(),
    due_date: z.string(),
    message: z.string().optional(),
    assigned_to: z.string(),
  }),
})

export const ListCommunityTasks = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z.union([z.literal('completed'), z.literal('pending')]).optional(),
    type: z.union([z.literal('plant'), z.literal('harvest')]).optional(),
  }),
})

export const ListCommunityEvents = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    type: z.union([z.literal('private'), z.literal('public')]).optional(),
    filter: z
      .union([z.literal('upcoming'), z.literal('previous')])
      .default('upcoming'),
  }),
})

export const CreateCommunityEvent = z.object({
  body: z.object({
    farmid: z.string(),
    title: z.string(),
    about: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    type: z.union([z.literal('private'), z.literal('public')]),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
  }),
})

export const UpdateCommunityEvent = z.object({
  body: z.object({
    title: z.string().optional(),
    about: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    type: z.union([z.literal('private'), z.literal('public')]).optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
  }),
})

export type CreateCommunityEventT = z.infer<typeof CreateCommunityEvent>
export type UpdateCommunityEventT = z.infer<typeof UpdateCommunityEvent>
