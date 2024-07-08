import multer from 'multer'
import ApiError from '../utils/ApiError'

const storage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new ApiError(400, 'Not an image! Please upload only images'), false)
  }
}

const uploadMiddleware = multer({
  storage,
  fileFilter: multerFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
})

export default uploadMiddleware
