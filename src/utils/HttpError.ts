import { ZodIssue } from 'zod'

class HttpError extends Error {
  httpCode: number
  validationErrors: ZodIssue[]

  constructor(
    message: string,
    httpCode: number,
    validationErrors?: ZodIssue[]
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.message = message || 'Wrong request. Please try again.'
    this.httpCode = httpCode || 500
    this.validationErrors = validationErrors || []
  }
}

export default HttpError
