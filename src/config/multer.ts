import multer from 'multer'
import path from 'path'
import * as dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()

const imageFolderPath = path.join(__dirname, '../../', 'uploads')

const upload = multer({
  limits: {
    fileSize: 1_000_000,
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(
        null,
        process.env.NODE_ENV === 'development'
          ? imageFolderPath
          : process.env.STORAGE_URL
      )
    },
    filename: function (req, file, cb) {
      cb(
        null,
        Math.floor(crypto.randomBytes(8).readUInt32LE(0)) +
          path.extname(file.originalname)
      )
    },
  }),
})

export default upload
