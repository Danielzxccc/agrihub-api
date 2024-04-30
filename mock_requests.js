const moment = require('moment')
const zod = require('zod')
const inputDate = '2024-05-01T13:00'
console.log()

const UpdateCommunityEvent = zod.object({
  body: zod.object({
    start_date: zod
      .string()
      .transform((arg) => moment(arg).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')),
  }),
})

const parsedDate = UpdateCommunityEvent.safeParse({
  body: {
    start_date: inputDate,
  },
})

console.log(parsedDate.data)
