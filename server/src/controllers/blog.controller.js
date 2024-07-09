import cloudinary from '~/config/cloudinary'
import catchAsync from '~/utils/catchAsync'
import fs from 'fs'
import path from 'path'
import ApiError from '~/utils/ApiError'
import writeFile from '~/utils/writeFile'
import { nanoid } from 'nanoid'
import { Blog, User } from '~/model'

export const uploadImage = catchAsync(async (req, res, next) => {
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

export const createBlog = catchAsync(async (req, res, next) => {
  const authorId = req.user._id
  let { title, banner, des, tags, content, darft } = req.body

  if (!title || !banner || !des || !tags || !content || !content.blocks) {
    throw new ApiError(400, 'Please fill all fields')
  }

  if (des.length > 200) {
    throw new ApiError(400, 'Description should be less than 200 characters')
  }

  if (tags.length > 10) {
    throw new ApiError(400, 'Maximum 10 tags are allowed')
  }

  tags = tags.map((tag) => tag.toLowerCase())
  tags = [...new Set(tags)]

  const slug = title.toLowerCase().split(' ').join('-') + '-' + nanoid()

  const blog = await Blog.create({
    slug,
    title,
    banner,
    des,
    tags,
    content,
    author: authorId,
    draft: Boolean(darft)
  })

  await User.findByIdAndUpdate(authorId, {
    $inc: { 'account_info.total_posts': blog.draft ? 0 : 1 },
    $push: { blogs: blog._id }
  })

  res.status(200).json({ status: 'success', id: blog.slug })
  // res.status(200).json({ status: 'success', blog })
})
