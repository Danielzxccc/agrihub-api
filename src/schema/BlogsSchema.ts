import { z } from 'zod'

export const NewBlog = z.object({
  body: z.object({
    bg_image: z.string({ required_error: 'background image is required' }),
    title: z.string({ required_error: 'title is required' }),
    author: z.string({ required_error: 'author is required' }),
    description: z.string({ required_error: 'description is required' }),
  }),
})

export const UpdateBlogs = z.object({
  body: z.object({
    bg_image: z.string().optional(),
    title: z.string().optional(),
    author: z.string().optional(),
    description: z.string().optional(),
  }),
})

export const ListBlogs = z.object({
  query: z.object({
    search: z.string().optional().default(''),
  }),
})
