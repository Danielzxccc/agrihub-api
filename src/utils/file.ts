import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
import log from './utils'
dotenv.config()

function pathFolder(): string {
  const localPath = path.join(__dirname, '../../', 'uploads')
  const serverPath = process.env.STORAGE_URL

  return process.env.NODE_ENV === 'development' ? localPath : serverPath
}

export function deleteFile(filename: string) {
  fs.unlink(`${pathFolder()}/${filename}`, (err) => {
    if (err) {
      console.error(`Error deleting old image: ${err}`)
      // Handle the error appropriately (e.g., logging, sending a response, etc.)
    } else {
      log.info('file deleted successfully')
    }
  })
}

export async function readFileAsStream(
  filePath: string
): Promise<fs.ReadStream> {
  return fs.createReadStream(filePath)
}
