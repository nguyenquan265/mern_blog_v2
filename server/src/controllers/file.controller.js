import cloudinary from '~/config/cloudinary'
import catchAsync from '~/utils/catchAsync'
import fs from 'fs'
import path from 'path'
import ApiError from '~/utils/ApiError'
import writeFile from '~/utils/writeFile'

export const uploadByFile = catchAsync(async (req, res, next) => {
  const { file } = req

  if (!file) {
    throw new ApiError(400, 'No file uploaded')
  }

  const tempFilePath = path.join(__dirname, file.originalname)
  await writeFile(tempFilePath, file.buffer)

  const result = await cloudinary.uploader.upload(tempFilePath, {
    folder: 'file-upload'
  })

  fs.unlinkSync(tempFilePath)

  return res.status(200).json({ success: 1, file: { url: result.secure_url } })
})

export const uploadByURL = catchAsync(async (req, res, next) => {
  const { url } = req.body

  if (!url) {
    throw new ApiError(400, 'No URL provided')
  }

  const result = await cloudinary.uploader.upload(url, {
    folder: 'file-upload'
  })

  return res.status(200).json({ success: 1, file: { url: result.secure_url } })
})
