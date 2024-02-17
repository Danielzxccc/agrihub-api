import { z } from 'zod'

export const NewDraftEvent = z.object({
  body: z.object({
    title: z.string(),
  }),
})

export const UpdateDraftEvent = z.object({
  body: z.object({
    event_start: z.string(),
    event_end: z.string(),
    location: z.string(),
    title: z.string(),
    about: z.string(),
    type: z.string(),
    guide: z.string(),
  }),
  file: z.object({
    filename: z.string(),
  }),
})
