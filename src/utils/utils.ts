import logger from 'pino'
import crypto from 'crypto'
import { Request } from 'express'
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
