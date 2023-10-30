import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
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
      console.log('Old avatar deleted successfully')
    }
  })
}
