import { z } from 'zod'

export const NewEvent = z.object({
  body: z.object({
    event_name: z.string({ required_error: 'event name is required' }),
    event_location: z.string({ required_error: 'location is required' }),
    details: z.string({ required_error: 'description is required' }),
    scope: z.string({ required_error: 'scope is required' }),
    event_date: z.string({ required_error: 'event_date is required' }),
    imagesrc: z.string().optional(),
  }),
})

export const UpdateEvent = z.object({
  body: z.object({
    event_name: z
      .string({ required_error: 'event name is required' })
      .optional(),
    event_location: z
      .string({ required_error: 'location is required' })
      .optional(),
    details: z.string({ required_error: 'description is required' }).optional(),
    scope: z.string({ required_error: 'scope is required' }).optional(),
    event_date: z
      .string({ required_error: 'event_date is required' })
      .optional(),
  }),
})

export const ListEvents = z.object({
  query: z.object({
    search: z.string().optional().default(''),
  }),
})
