import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import log from '../utils/utils'
export function multerLimitter(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  log.warn(err.message, 'ERROR FROM MULTER')
  if (err instanceof multer.MulterError) {
    // Multer error occurred (file size exceeded)
    res.status(400).json({
      error: true,
      message: err.message,
    })
  } else {
    next(err)
  }
}
