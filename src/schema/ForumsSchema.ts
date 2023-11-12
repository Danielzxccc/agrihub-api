import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     QuestionSchema:
 *       type: object
 *       required:
 *         - title
 *         - question
 *         - imagesrc
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the forum entry
 *         question:
 *           type: string
 *           description: The question in the forum entry
 *         imagesrc:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: One or more tags associated with the forum
 *
 *     NewQuestionSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the new question
 *         userid:
 *           type: string
 *           description: The user ID associated with the question
 *         title:
 *           type: string
 *           description: The title of the new question
 *         question:
 *           type: string
 *           description: The content of the new question
 *         imagesrc:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs associated with the question
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the question was created
 *         updatedat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the question was last updated
 */

export const SearchForums = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
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
