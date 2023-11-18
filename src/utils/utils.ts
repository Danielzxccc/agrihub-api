import logger from 'pino'
import crypto from 'crypto'
const log = logger({
  transport: {
    target: 'pino-pretty',
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
})

export function getVerificationLevel(level: string) {
  return isNaN(parseInt(level)) ? 0 : parseInt(level)
}

export const generateFileName = (bytes = 8) =>
  crypto.randomBytes(bytes).toString('hex')

export default log
