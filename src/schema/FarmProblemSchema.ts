import { z } from 'zod'

export const NewFarmProblem = z.object({
  body: z.object({
    id: z.string().optional(),
    problem: z.string(),
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
