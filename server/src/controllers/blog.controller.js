import cloudinary from '~/config/cloudinary'
import catchAsync from '~/utils/catchAsync'
import fs from 'fs'
import util from 'util'
import path from 'path'

const writeFile = util.promisify(fs.writeFile)

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
  }

  return res.status(200).json({ status: 'success' })
})
