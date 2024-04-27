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
