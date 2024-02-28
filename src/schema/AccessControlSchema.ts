import { z } from 'zod'

export const NewAdmin = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    access: z.object({
      farms: z.boolean().optional(),
      learning: z.boolean().optional(),
      event: z.boolean().optional(),
      blog: z.boolean().optional(),
      forums: z.boolean().optional(),
      admin: z.boolean().optional(),
      cuai: z.boolean().optional(),
      home: z.boolean().optional(),
      about: z.boolean().optional(),
      users: z.boolean().optional(),
      privacy_policy: z.boolean().optional(),
      terms_and_conditions: z.boolean().optional(),
      user_feedback: z.boolean().optional(),
      crops: z.boolean().optional(),
      help_center: z.boolean().optional(),
      activity_logs: z.boolean().optional(),
    }),
  }),
})

export const UpdateAccessControl = z.object({
  body: z.object({
    farms: z.boolean().optional(),
    learning: z.boolean().optional(),
    event: z.boolean().optional(),
    blog: z.boolean().optional(),
    forums: z.boolean().optional(),
    admin: z.boolean().optional(),
    cuai: z.boolean().optional(),
    home: z.boolean().optional(),
    about: z.boolean().optional(),
    users: z.boolean().optional(),
    privacy_policy: z.boolean().optional(),
    terms_and_conditions: z.boolean().optional(),
    user_feedback: z.boolean().optional(),
    crops: z.boolean().optional(),
    help_center: z.boolean().optional(),
    activity_logs: z.boolean().optional(),
  }),
})
