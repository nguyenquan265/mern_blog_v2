import cloudinary from '~/config/cloudinary'
import catchAsync from '~/utils/catchAsync'
import fs from 'fs'
import path from 'path'
import ApiError from '~/utils/ApiError'
import writeFile from '~/utils/writeFile'

export const uploadBanner = catchAsync(async (req, res, next) => {
  if (req.file) {
    // if (req.user.photo) {
    //   await cloudinary.uploader.destroy(
    //     req.user.photo_publicId || req.user.photo.split('/').pop().split('.')[0]
    //   )
    // }

    const tempFilePath = path.join(__dirname, req.file.originalname)
    await writeFile(tempFilePath, req.file.buffer)

    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'file-upload'
    })

    fs.unlinkSync(tempFilePath)

    return res
      .status(200)
      .json({ status: 'success', imgURL: result.secure_url })
  } else {
    throw new ApiError(400, 'No file uploaded')
  }
})
