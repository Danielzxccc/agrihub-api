import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import log from '../utils/utils'
export function multerLimitter(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    // Multer error occurred (file size exceeded)
    log.warn('File too big')
    res.status(400).json({ error: err.message })
  } else {
    next(err)
  }
}
