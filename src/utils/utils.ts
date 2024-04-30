import logger from 'pino'
import crypto from 'crypto'
import { Request } from 'express'
import { ToolRequestStatus } from 'kysely-codegen'
import { UpdateToolRequest } from '../types/DBTypes'
import { deleteFile } from './file'
import moment from 'moment'
const log = logger({
  transport: {
    target: 'pino-pretty',
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
})

export default log

export function getVerificationLevel(level: string) {
  return isNaN(parseInt(level)) ? 0 : parseInt(level)
}

export const generateFileName = (bytes = 8) =>
  crypto.randomBytes(bytes).toString('hex')

export const getUploadedFiles = (
  req: Request,
  fieldName: string,
  index?: number
) => {
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined
  if (index !== undefined) {
    return files?.[fieldName]?.[index] ? [files[fieldName][index]] : null
  }
  return files?.[fieldName] || null
}

export function getMonthByIndex(index: number) {
  if (index > 11) return null

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const currentMonthName = monthNames[index]
  return currentMonthName
}

export function generateOTP() {
  // Generate a random 3-byte buffer

  return Math.floor(100000 + Math.random() * 900000)
}

export function getToolRequestNotification(
  status: ToolRequestStatus,
  request: UpdateToolRequest
) {
  switch (status) {
    case 'accepted':
      return {
        title: `Congratulations!, your request for ${request.tool_requested} has been accepted`,
        body: `Your request is accepted by ${request.accepted_by.join()}. We are now preparing your request. Stay tuned for further updates.`,
      }
    case 'communicating':
      return {
        title: `Greeting!, your ${request.tool_requested} is now ready.`,
        body: `To get your requested tool kindy ${request.client_note}. If you have any questions or require clarification, do not hesitate to contact us.`,
      }
    case 'completed':
      return {
        title: `Congratulations, your tool request  for ${request.tool_requested} is now completed`,
        body: `Your reqeust for ${request.tool_requested} is now completed. `,
      }
    case 'forwarded':
      return {
        title: `Hello!, your reqest for ${request.tool_requested} has been forwarded`,
        body: `Your request for ${
          request.tool_requested
        } has been forwarded to ${request.forwarded_to.join()}. We will keep you updated as soon as we receive any further information regarding your request.`,
      }
    case 'rejected':
      return {
        title: `Request for ${request.tool_requested} is Rejected`,
        body: `We regret to inform you that your request for ${request.tool_requested} has been rejected. Due to ${request.client_note} If you have any questions or need further clarification, please feel free to reach out to us."`,
      }
    default:
      break
  }
}

export async function deleteLocalFiles(files: Express.Multer.File[]) {
  for (const file of files) {
    deleteFile(file.filename)
  }
}

export function formatTimestamp(inputDate: string) {
  return moment(inputDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
}

// export function formatUTC(date: Date) {}

export function formatUTC(date: Date) {
  return new Promise<Date>((resolve) => {
    const formattedDate = new Date(
      formatTimestamp(new Date(date).toUTCString())
    ) // Just an example, replace with your implementation
    resolve(formattedDate)
  })
}
