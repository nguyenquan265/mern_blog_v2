import multer from 'multer'
import ApiError from './ApiError'

const storage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new ApiError(400, 'Not an image! Please upload only images'), false)
  }
}

const upload = multer({ storage, fileFilter: multerFilter })

export default upload
