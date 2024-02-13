import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import HttpError from '../../utils/HttpError'
import { deleteFileCloud, uploadFiles } from '../AWS-Bucket/UploadService'
import { deleteFile } from '../../utils/file'

export async function uploadAttachment(req: Request, res: Response) {
  try {
    var file = req.file

    if (!file) {
      throw new HttpError('No file attached', 400)
    } else {
      await uploadFiles([file])

      deleteFile(file?.filename)
    }

    res.status(200).json({ file: file.filename })
  } catch (error) {
    deleteFile(file?.filename)
    errorHandler(res, error)
  }
}

export async function deleteUploadedFile(req: Request, res: Response) {
  try {
    const { file } = req.params

    const action = await deleteFileCloud(file)
    res.status(200).json({ message: 'Deleted Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}
