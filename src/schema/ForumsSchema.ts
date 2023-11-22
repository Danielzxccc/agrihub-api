import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     QuestionsResponse:
 *       type: object
 *       properties:
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   avatar:
 *                     type: string
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     tag:
 *                       type: string
 *               title:
 *                 type: string
 *               question:
 *                 type: string
 *               imagesrc:
 *                 type: array
 *                 items:
 *                   type: string
 *               createdat:
 *                 type: string
 *                 format: date-time
 *               updatedat:
 *                 type: string
 *                 format: date-time
 *               answer_count:
 *                 type: string
 *               vote_count:
 *                 type: string
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             per_page:
 *               type: integer
 *             total_pages:
 *               type: integer
 *             total_records:
 *               type: integer
 */

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

/**
 *
 * @openapi
 * components:
 *   schemas:
 *     QuestionViewSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             avatar:
 *               type: string
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *           required:
 *             - avatar
 *             - id
 *             - username
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               tag:
 *                 type: string
 *             required:
 *               - tag
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               answer:
 *                 type: string
 *               id:
 *                 type: integer
 *               isaccepted:
 *                 type: boolean
 *               user:
 *                 type: object
 *                 properties:
 *                   avatar:
 *                     type: string
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                 required:
 *                   - avatar
 *                   - id
 *                   - username
 *             required:
 *               - answer
 *               - id
 *               - isaccepted
 *               - user
 *         title:
 *           type: string
 *         question:
 *           type: string
 *         imagesrc:
 *           type: array
 *           items:
 *             type: string
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         views:
 *           type: string
 *         answer_count:
 *           type: string
 *         vote_count:
 *           type: string
 *         latest_answer_createdat:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - user
 *         - tags
 *         - answers
 *         - title
 *         - question
 *         - imagesrc
 *         - createdat
 *         - updatedat
 *         - answer_count
 *         - vote_count
 *         - latest_answer_createdat
 */

export const SearchForums = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z.string().optional().default('newest'),
  }),
})
/**
 * @openapi
 * components:
 *   schemas:
 *     VoteResponseSchema:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         vote:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             questionid:
 *               type: string
 *             userid:
 *               type: string
 *             type:
 *               type: string
 *             createdat:
 *               type: string
 *             updatedat:
 *               type: string
 */
export const VoteQuestion = z.object({
  params: z.object({
    id: z.string({ required_error: 'id is required' }),
  }),
  body: z.object({
    type: z.union([z.literal('upvote'), z.literal('downvote')]),
  }),
})

export const ViewQuestion = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
  }),
  params: z.object({
    id: z.string({ required_error: 'id is required' }),
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
    tags: z.union([z.array(z.string()), z.string()]).optional(),
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
