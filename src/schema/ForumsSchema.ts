import { z } from 'zod'

export const ForumsSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, 'Title must not be empty'),
    question: z
      .string({ required_error: 'Question is required' })
      .min(1, 'Question must not be empty'),
  }),
})
