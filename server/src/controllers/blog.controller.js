import cloudinary from '~/config/cloudinary'
import catchAsync from '~/utils/catchAsync'
import fs from 'fs'
import path from 'path'
import ApiError from '~/utils/ApiError'
import writeFile from '~/utils/writeFile'
import { nanoid } from 'nanoid'
import { Blog, User } from '~/model'

export const getLatestBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find({ draft: false })

    .populate(
      'author',
      'personal_info.username personal_info.profile_img personal_info.fullname -_id'
    )
    .sort({ publishedAt: -1 })
    .select('slug title des banner activity tags publishedAt -_id')
    .limit(5)

  res.status(200).json({ status: 'success', blogs })
})

export const uploadImage = catchAsync(async (req, res, next) => {
  if (req.file) {
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
  let { title, banner, des, tags, content, draft } = req.body

  if (!title) {
    throw new ApiError(400, 'Please enter a title')
  }

  // If blog is not a draft then validate other fields
  if (!draft) {
    if (!banner) {
      throw new ApiError(400, 'Please upload a banner')
    }

    if (!content || !content.blocks) {
      throw new ApiError(400, 'Please write some content')
    }

    if (!des || des.length > 200) {
      throw new ApiError(400, 'Description should be less than 200 characters')
    }

    if (!tags || tags.length > 10) {
      throw new ApiError(400, 'Maximum 10 tags are allowed')
    } else {
      // Convert tags to lowercase and remove duplicates
      tags = tags.map((tag) => tag.toLowerCase())
      tags = [...new Set(tags)]
    }
  }

  // Create slug
  const slug = title.toLowerCase().split(' ').join('-') + '-' + nanoid()

  const blog = await Blog.create({
    slug,
    title,
    banner,
    des,
    tags,
    content,
    author: authorId,
    draft: Boolean(draft)
  })

  await User.findByIdAndUpdate(authorId, {
    $inc: { 'account_info.total_posts': blog.draft ? 0 : 1 }, // Increment total_posts if blog is published
    $push: { blogs: blog._id } // Add blog to user's blogs array
  })

  res.status(200).json({ status: 'success', id: blog.slug })
  // res.status(200).json({ status: 'success', blog })
})
