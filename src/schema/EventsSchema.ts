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

export const NewEventPartnership = z.object({
  body: z.object({
    name: z.string(),
    organizer: z.string().transform((arg) => Boolean(arg)),
    type: z.string(),
  }),
  file: z.object({
    filename: z.string(),
  }),
})

export const updateEventPartnership = z.object({
  body: z.object({
    name: z.string().optional(),
    organizer: z
      .string()
      .transform((arg) => Boolean(arg))
      .optional(),
    type: z.string().optional(),
  }),
  file: z
    .object({
      filename: z.string(),
    })
    .optional(),
})

export const NewEventSpearker = z.object({
  body: z.object({
    title: z.string(),
    name: z.string(),
  }),
  file: z.object({
    filename: z.string(),
  }),
})

export const UpdateEventSpeaker = z.object({
  body: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
  }),
  file: z
    .object({
      filename: z.string(),
    })
    .optional(),
})

export const NewEventTags = z.object({
  body: z.object({
    tags: z.union([z.array(z.string()), z.string()]),
  }),
})

export const ListDraftEvents = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
  }),
})
