import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'
import fs from 'fs'
import { readFileAsStream } from '../../utils/file'
dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME

const s3Client = new S3Client({ region: process.env.AWS_REGION })

export function uploadFile(
  filePath: fs.ReadStream,
  fileName: string,
  mimetype: string
) {
  const uploadParams = {
    Bucket: bucketName,
    Body: filePath,
    Key: fileName,
    ContentType: mimetype,
  }

  return s3Client.send(new PutObjectCommand(uploadParams))
}

export async function uploadFiles(files: Express.Multer.File[]) {
  const params = files.map(async (file) => {
    const stream: fs.ReadStream = await readFileAsStream(file.path)
    return {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: file.filename,
      Body: stream,
      ContentType: file.mimetype,
    }
  })

  const uploadPromises = params.map(async (param) =>
    s3Client.send(new PutObjectCommand(await param))
  )

  return Promise.all(uploadPromises)
}

export function deleteFile(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams))
}

export function getObjectUrl(key: string) {
  return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${key}`
}

export async function getObjectSignedUrl(key: string) {
  const params = {
    Bucket: bucketName,
    Key: key,
  }

  const command = new GetObjectCommand(params)
  const seconds = 60
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds })

  return url
}
