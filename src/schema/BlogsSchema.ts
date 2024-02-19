import { z } from 'zod'

export const NewBlog = z.object({
  body: z.object({
    title: z.string(),
  }),
})

export const UpdateBlog = z.object({
  body: z.object({
    title: z.string(),
    category: z.string(),
    content: z.string(),
    author: z.string(),
    author_title: z.string(),
  }),
})

export const NewBlogImage = z.object({
  file: z.object({
    filename: z.string(),
  }),
})
