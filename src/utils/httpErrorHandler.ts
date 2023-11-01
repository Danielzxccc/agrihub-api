import { Response } from 'express'
import HttpError from './HttpError'

function errorHandler(
  res: Response,
  error: any,
  message?: string,
  status?: number
) {
  console.log(typeof error)
  if (error instanceof HttpError) {
    return res.status(error.httpCode || 500).json({
      error: true,
      message: message || error.message,
      validationErrors: error.validationErrors,
    })
  }

  if (error instanceof Error) {
    return res
      .status(status || 500)
      .json({ error: true, message: error.message })
  }
}

export default errorHandler
