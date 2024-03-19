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
 *                   role:
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
 *               vote:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
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
 * @openapi
 * components:
 *   schemas:
 *     QuestionViewSchema:
 *       type: object
 *       properties:
 *         question:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the question
 *             user:
 *               $ref: "#/components/schemas/UserObject"
 *             tags:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/QuestionTags"
 *             answers:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Answer"
 *             title:
 *               type: string
 *               description: The title of the question
 *             question:
 *               type: string
 *               description: The HTML content of the question
 *             imagesrc:
 *               type: array
 *               items:
 *                 type: string
 *               description: The array of image URLs associated with the question
 *             createdat:
 *               type: string
 *               description: The timestamp when the question was created
 *             updatedat:
 *               type: string
 *               description: The timestamp when the question was last updated
 *             views:
 *               type: string
 *               description: The number of views for the question
 *             answer_count:
 *               type: string
 *               description: The count of answers for the question
 *             vote_count:
 *               type: string
 *               description: The total count of votes for the question
 *             vote:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *               description: The vote information (null in the provided example)
 *         pagination:
 *           $ref: "#/components/schemas/Pagination"
 *
 *     UserObject:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *           description: The URL of the user's avatar
 *         id:
 *           type: string
 *           description: The ID of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *
 *     QuestionTags:
 *       type: object
 *       properties:
 *         tag:
 *           type: string
 *           description: The tag associated with the question
 *
 *     Answer:
 *       type: object
 *       properties:
 *         answer:
 *           type: string
 *           description: The answer text
 *         comments:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Comment"
 *         id:
 *           type: string
 *           description: The ID of the answer
 *         isaccepted:
 *           type: boolean
 *           description: Indicates whether the answer is accepted
 *         total_vote_count:
 *           type: integer
 *           description: The total count of votes for the answer
 *         upvote_count:
 *           type: integer
 *           description: The count of upvotes for the answer
 *         user:
 *           $ref: "#/components/schemas/UserObject"
 *         createdat:
 *           type: string
 *         vote:
 *           type: object
 *           properties:
 *             id:
 *              type: string
 *             type:
 *              type: string
 *
 *     Comment:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *           description: The comment text
 *         user:
 *           $ref: "#/components/schemas/UserObject"
 *         createdat:
 *           type: string
 *         id:
 *           type: string
 */

export const SearchForums = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z.string().optional().default('newest'),
    profile: z.string().optional().default(''),
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
    filter: z.union([z.literal('newest'), z.literal('top')]).default('newest'),
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

/**
 * @openapi
 * components:
 *   schemas:
 *     CommentsSchema:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *           minLength: 1
 *           description: The comment text (required)
 *
 *     NewCommentResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the comment creation
 *         newComment:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the created comment
 *             userid:
 *               type: string
 *               description: The ID of the user who posted the comment
 *             answerid:
 *               type: string
 *               description: The ID of the answer to which the comment belongs
 *             comment:
 *               type: string
 *               description: The comment text
 *             createdat:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the comment was created
 *             updatedat:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the comment was last updated
 */

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

/**
 * @openapi
 * components:
 *   schemas:
 *     AnswersSchema:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the created answer
 *         userid:
 *           type: string
 *           description: The ID of the user who posted the answer
 *         forumid:
 *           type: string
 *           description: The ID of the forum post
 *         answer:
 *           type: string
 *           minLength: 1
 *           description: The answer text
 *         isaccepted:
 *           type: boolean
 *           description: Indicates whether the answer is accepted
 *         createdat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the answer was created
 *         updatedat:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the answer was last updated
 *
 *     NewAnswerResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the answer creation
 *         newAnswer:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the created answer
 *             userid:
 *               type: string
 *               description: The ID of the user who posted the answer
 *             forumid:
 *               type: string
 *               description: The ID of the forum post
 *             answer:
 *               type: string
 *               description: The answer text
 *             isaccepted:
 *               type: boolean
 *               description: Indicates whether the answer is accepted
 *             createdat:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the answer was created
 *             updatedat:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the answer was last updated
 */

export const AnswersSchema = z.object({
  body: z.object({
    answer: z
      .string({ required_error: 'Answer is required' })
      .min(1, 'Answer must not be empty'),
  }),
})

/**
 * @openapi
 * components:
 *   schemas:
 *     VoteAnswerSchema:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum:
 *             - upvote
 *             - downvote
 *           description: The type of vote (required)
 *
 *     VoteAnswerSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message indicating the success of the vote
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the vote record
 *             answerid:
 *               type: string
 *               description: The ID of the voted answer
 *             userid:
 *               type: string
 *               description: The ID of the user who voted
 *             type:
 *               type: string
 *               enum:
 *                 - upvote
 *                 - downvote
 *               description: The type of vote
 *             createdat:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the vote was created
 *             updatedat:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the vote was last updated
 */

export const VoteAnswerSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'id is required' }),
  }),
  body: z.object({
    type: z.union([z.literal('upvote'), z.literal('downvote')]),
  }),
})

export type ForumsContent = z.infer<typeof ForumsSchema>

/**
 * @openapi
 * components:
 *   schemas:
 *     DeleteVoteAnswerResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The success message indicating that the vote has been deleted
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     DeleteVoteForumResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The success message indicating that the vote has been deleted
 *       required:
 *         - message # Making the 'message' property required
 */

export const ReportQuestion = z.object({
  body: z.object({
    reason: z.string(),
  }),
})
