import multer from 'multer'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()

const imageFolderPath = path.join(__dirname, '../../', 'uploads')

const upload = multer({
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
      cb(null, Math.random().toFixed(2) + path.extname(file.originalname))
    },
  }),
})

export default upload
