import cloudinary from '~/config/cloudinary'
import catchAsync from '~/utils/catchAsync'
import fs from 'fs'
import path from 'path'
import ApiError from '~/utils/ApiError'
import writeFile from '~/utils/writeFile'
import { nanoid } from 'nanoid'
import { Blog, User } from '~/model'

export const searchBlogs = catchAsync(async (req, res, next) => {
  let queryObj = { draft: false }

  // tag
  if (req.query.tag) {
    queryObj.tags = req.query.tag
  }

  // search
  if (req.query.query) {
    queryObj.title = { $regex: req.query.query, $options: 'i' }
  }

  // author
  if (req.query.authorId) {
    const author = await User.findById(req.query.authorId)

    if (!author) {
      throw new ApiError(404, 'User not found')
    }

    queryObj.author = author._id
  }

  // eliminateSlug
  if (req.query.eliminateSlug) {
    queryObj.slug = { $ne: req.query.eliminateSlug }
  }

  // pagination
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 2
  const skip = (page - 1) * limit

  const [blogs, totalDocs] = await Promise.all([
    Blog.find(queryObj)
      .populate(
        'author',
        'personal_info.username personal_info.profile_img personal_info.fullname -_id'
      )
      .sort({ publishedAt: -1 })
      .select('slug title des banner activity tags publishedAt -_id')
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(queryObj)
  ])

  res.status(200).json({ status: 'success', blogs, page, totalDocs })
})

export const getLatestBlogs = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 5
  const skip = (page - 1) * limit

  const [blogs, totalDocs] = await Promise.all([
    Blog.find({ draft: false })
      .populate(
        'author',
        'personal_info.username personal_info.profile_img personal_info.fullname -_id'
      )
      .sort({ publishedAt: -1 })
      .select('slug title des banner activity tags publishedAt -_id')
      .skip(skip)
      .limit(limit),
    Blog.countDocuments({ draft: false })
  ])

  res.status(200).json({ status: 'success', blogs, page, totalDocs })
})

export const getTrendingBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find({ draft: false })
    .populate(
      'author',
      'personal_info.username personal_info.profile_img personal_info.fullname -_id'
    )
    .sort({
      'activity.total_reads': -1,
      'activity.total_likes': -1,
      publishedAt: -1
    })
    .select('slug title publishedAt -_id')
    .limit(5)

  res.status(200).json({ status: 'success', blogs })
})

export const getBlogBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params
  const { draft, mode } = req.query

  // Increment total_reads if mode is not edit
  const incrementValue = mode !== 'edit' ? 1 : 0

  // Find blog by slug and increment total_reads
  const blog = await Blog.findOneAndUpdate(
    { slug },
    { $inc: { 'activity.total_reads': incrementValue } }
  )
    .populate(
      'author',
      'personal_info.username personal_info.profile_img personal_info.fullname'
    )
    .select('slug title des banner content activity tags publishedAt')

  if (!blog) {
    throw new ApiError(404, 'Blog not found')
  }

  // If blog is a draft then only author can access it
  if (blog.draft && !draft) {
    throw new ApiError(404, 'You can not access draft blog')
  }

  // If blog is a draft then total_reads will not increase else increment total_reads
  await User.findByIdAndUpdate(blog.author._id, {
    $inc: { 'account_info.total_reads': incrementValue }
  })

  res.status(200).json({ status: 'success', blog })
})

// protected route
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
  let {
    title,
    banner,
    des,
    tags,
    content,
    draft,
    slug: slugFromBrowser
  } = req.body

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
  const newSlug =
    slugFromBrowser ||
    title.toLowerCase().split(' ').join('-') + '-' + nanoid(5)

  // If slug exists then update blog else create new blog
  if (slugFromBrowser) {
    const blog = await Blog.findOneAndUpdate(
      { slug: newSlug },
      {
        title,
        banner,
        des,
        tags,
        content,
        draft: draft ? draft : false
      }
    )

    res.status(200).json({ status: 'success', id: blog.slug })
  } else {
    const blog = await Blog.create({
      slug: newSlug,
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
  }
})
