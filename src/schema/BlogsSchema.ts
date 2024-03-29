import { z } from 'zod'

export const NewBlog = z.object({
  body: z.object({
    title: z.string(),
  }),
})

export const UpdateBlog = z.object({
  body: z.object({
    title: z.string(),
    category: z.string().optional(),
    content: z.string().optional(),
    author: z.string().optional(),
    author_title: z.string().optional(),
  }),
})

export const NewBlogImage = z.object({
  file: z.object({
    filename: z.string(),
  }),
})

export const NewBlogTags = z.object({
  body: z.object({
    tags: z.union([z.array(z.string()), z.string()]),
  }),
})

export const ListDraftBlogs = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z.string().optional().default(''),
  }),
})
