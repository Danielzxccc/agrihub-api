import { z } from 'zod'

export const SearchForums = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('10'),
    filter: z.string().optional().default('newest'),
  }),
})

export const ForumsSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, 'Title must not be empty'),
    question: z
      .string({ required_error: 'Question is required' })
      .min(1, 'Question must not be empty'),
    tags: z.array(z.string()).optional(),
  }),
})

export const CommentsSchema = z.object({
  params: z.object({
    answerId: z.string(),
  }),

  body: z.object({
    comment: z
      .string({ required_error: 'Comment is required' })
      .min(1, 'Comment must not be empty'),
  }),
})

export const AnswersSchema = z.object({
  body: z.object({
    answer: z
      .string({ required_error: 'Answer is required' })
      .min(1, 'Answer must not be empty'),
  }),
})

export type ForumsContent = z.infer<typeof ForumsSchema>
