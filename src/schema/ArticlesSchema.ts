import { z } from 'zod'

export const ArticleSchema = z.object({
  body: z.object({
    userid: z
      .string({ required_error: 'username is required' })
      .min(1, 'username is required'),
    title: z
      .string({ required_error: 'title is required' })
      .min(1, 'title is required'),
    body: z
      .string({ required_error: 'body is required' })
      .min(1, 'body is required'),
    thumbnailsrc: z.string().optional(),
    imagesrc: z.string().optional(),
  }),
})
