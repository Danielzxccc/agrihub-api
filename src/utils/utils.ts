import logger from 'pino'

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

export default log
