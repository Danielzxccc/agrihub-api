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

// Function to replace avatars in a JSON object with the corresponding URLs
export async function replaceAvatarsWithUrls(jsonObject: any): Promise<any> {
  const replaceAvatarAsync = async (avatarKey: string) => {
    const avatarUrl = await getObjectUrl(avatarKey)
    return avatarUrl
  }

  const replaceAvatarsRecursively = async (obj: any): Promise<any> => {
    if (obj instanceof Array) {
      return Promise.all(obj.map(replaceAvatarsRecursively))
    } else if (obj !== null && typeof obj === 'object') {
      const promises = Object.entries(obj).map(async ([key, value]) => {
        if (key === 'avatar' && typeof value === 'string') {
          // If the property is 'avatar' and the value is a string, replace it
          return { [key]: await replaceAvatarAsync(value) }
        } else {
          // Recursively replace avatars in nested objects
          return { [key]: await replaceAvatarsRecursively(value) }
        }
      })

      const replacedProperties = await Promise.all(promises)
      return Object.assign({}, ...replacedProperties)
    } else {
      return obj
    }
  }

  // Start the replacement process
  const replacedObject = await replaceAvatarsRecursively(jsonObject)
  return replacedObject
}
