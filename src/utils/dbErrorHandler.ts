import HttpError from './HttpError'
import log from './utils'

function dbErrorHandler(error: any) {
  log.warn(error.stack, 'database error')
  if (error instanceof HttpError) {
    throw new HttpError(error.message, error.httpCode || 500)
  }
  throw new Error(error.message || 'database failed')
}

export default dbErrorHandler
