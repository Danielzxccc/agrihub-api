import { z } from 'zod'

export const NewFarmProblem = z.object({
  body: z.object({
    id: z.string().optional(),
    problem: z.string(),
    common: z.boolean().optional().default(true),
    description: z.string(),
    materials: z.union([z.array(z.string()), z.string()]),
  }),
})

export const ListFarmProblems = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z
      .string()
      .optional()
      .default('')
      .transform((arg) => Boolean(arg)),
  }),
})

export const SendReportProblem = z.object({
  body: z
    .object({
      problem_id: z.string().optional(),
      date_noticed: z.string().optional(),
      is_other: z.boolean(),
      problem: z.string().optional(),
      description: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.is_other === true) {
          return data.problem !== undefined && data.description !== undefined
        } else {
          return (
            data.problem_id !== undefined && data.date_noticed !== undefined
          )
        }
      },
      {
        message:
          "If 'is_other' is true, 'problem' and 'description' must be provided else id and date noticed is required",
        path: ['body'],
      }
    ),
})

export type SendReportProblemT = z.infer<typeof SendReportProblem>
