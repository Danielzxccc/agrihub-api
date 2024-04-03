import { z } from 'zod'
import HttpError from '../utils/HttpError'

export const NewSeedlingRequest = z.object({
  body: z.object({
    crop_id: z.string().optional(),
    other: z.string().optional(),
    quantity_request: z.number(),
    note: z.string().optional(),
  }),
})

export const ListSeedlingRequest = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z
      .union([
        z.literal('pending'),
        z.literal('accepted'),
        z.literal('rejected'),
        z.literal(''),
      ])
      .default(''),
  }),
})

export const AcceptSeedlingRequest = z.object({
  body: z.object({
    quantity_approve: z.number(),
    delivery_date: z.string(),
    note: z.string().optional(),
  }),
})

export const NewToolRequest = z.object({
  body: z.object({
    tool_requested: z.string(),
    quantity_requested: z.string(),
    requester_note: z.string(),
    contact: z.string(),
  }),
})

export const UpdateToolRequestStatus = z.object({
  body: z
    .object({
      client_note: z.string().optional(),
      accepted_by: z.array(z.string()).optional(),
      status: z.union([
        z.literal('pending'),
        z.literal('accepted'),
        z.literal('communicating'),
        z.literal('rejected'),
        z.literal('completed'),
      ]),
    })
    .refine(
      (data) => {
        if (data.status === 'accepted' && !data.accepted_by) {
          return false
        }
        return true
      },
      {
        message: "Accepted by field is required when status is 'accepted'",
        path: ['status'], // You can specify the path where the error will be shown
      }
    ),
})

export const ListToolRequest = z.object({
  query: z.object({
    search: z.string().optional().default(''),
    page: z.string().optional(),
    perpage: z.string().optional().default('20'),
    filter: z
      .union([
        z.literal('pending'),
        z.literal('accepted'),
        z.literal('communicating'),
        z.literal('rejected'),
        z.literal('forwarded'),
        z.literal('completed'),
      ])
      .optional()
      .default('pending'),
    farmid: z.string().optional(),
  }),
})
