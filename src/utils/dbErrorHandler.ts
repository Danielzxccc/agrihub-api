import HttpError from './HttpError'

function dbErrorHandler(error: any) {
  if (error instanceof HttpError) {
    throw new HttpError(error.message, error.httpCode || 500)
  }
  throw new Error(error.message || 'database failed')
}

export default dbErrorHandler
