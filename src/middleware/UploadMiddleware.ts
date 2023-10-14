import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
export function multerLimitter(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    // Multer error occurred (file size exceeded)
    res.status(400).json({ error: 'File size limit exceeded' })
  } else {
    next(err)
  }
}
