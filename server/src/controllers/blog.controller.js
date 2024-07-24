import cloudinary from '~/config/cloudinary'
import catchAsync from '~/utils/catchAsync'
import fs from 'fs'
import path from 'path'
import ApiError from '~/utils/ApiError'
import writeFile from '~/utils/writeFile'
import { nanoid } from 'nanoid'
import { Blog, Comment, Notification, User } from '~/model'

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
      .select('slug title des banner activity tags publishedAt')
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
      .select('slug title des banner activity tags publishedAt')
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
    .select('slug title publishedAt')
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
    .populate('likes', 'personal_info.username')
    .select(
      'slug title des banner content activity tags publishedAt likes draft'
    )

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
export const getMyBlogs = catchAsync(async (req, res, next) => {
  const userId = req.user._id
  const { page, draft, query, deletedDocCount } = req.query

  // Pagination
  let skip = (page - 1) * 5

  if (deletedDocCount) {
    skip -= deletedDocCount // If user has deleted some blogs then adjust skip
  }

  // Find blogs
  const [blogs, totalDocs] = await Promise.all([
    Blog.find({
      author: userId,
      draft,
      title: { $regex: query, $options: 'i' }
    })
      .skip(skip)
      .limit(5)
      .sort({ publishedAt: -1 })
      .select('slug title des banner activity tags publishedAt draft'),
    Blog.countDocuments({
      author: userId,
      draft,
      title: { $regex: query, $options: 'i' }
    })
  ])

  res.status(200).json({ status: 'success', blogs, page, totalDocs })
})

export const deleteBlogBySlug = catchAsync(async (req, res, next) => {
  const userId = req.user._id
  const { slug } = req.params

  const blog = await Blog.findOneAndDelete({ slug, author: userId })

  await Promise.all([
    Notification.deleteMany({ blog: blog._id }),
    Comment.deleteMany({ blog_id: blog._id }),
    User.findByIdAndUpdate(userId, {
      $pull: { blogs: blog._id },
      $inc: { 'account_info.total_posts': blog.draft ? 0 : -1 } // Decrement total_posts
    })
  ])

  res.status(200).json({ status: 'success' })
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

  // If slug exists then update blog
  if (slugFromBrowser) {
    const blog = await Blog.findOneAndUpdate(
      { slug: newSlug },
      {
        title,
        banner,
        des,
        tags,
        content,
        draft: draft ? true : false
      }
    )

    await User.findByIdAndUpdate(authorId, {
      $inc: { 'account_info.total_posts': draft ? -1 : 1 } // Decrement total_posts if blog is draft
    })

    res.status(200).json({ status: 'success', id: blog.slug })
  } else {
    // else create new blog
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

export const likeBlog = catchAsync(async (req, res, next) => {
  const userId = req.user._id
  const { blogId, isLiked } = req.body
  const incrementValue = isLiked ? -1 : 1
  const updateLike = isLiked ? '$pull' : '$push'

  const blog = await Blog.findByIdAndUpdate(
    { _id: blogId },
    {
      $inc: { 'activity.total_likes': incrementValue },
      [updateLike]: { likes: userId }
    }
  )

  if (!blog) {
    throw new ApiError(404, 'Blog not found')
  }

  if (!isLiked) {
    const notification = await Notification.create({
      type: 'like',
      blog: blogId,
      notification_for: blog.author,
      user: userId
    })

    return res.status(200).json({ status: 'success', blog, notification })
  } else {
    await Notification.findOneAndDelete({
      type: 'like',
      blog: blogId,
      notification_for: blog.author,
      user: userId
    })

    return res.status(200).json({ status: 'success', blog })
  }
})

export const addComment = catchAsync(async (req, res, next) => {
  const userId = req.user._id
  const { blogId, comment, blogAuthor } = req.body

  if (!comment) {
    throw new ApiError(400, 'Comment cannot be empty')
  }

  const newComment = await Comment.create({
    blog_id: blogId,
    blog_author: blogAuthor,
    comment,
    commented_by: userId
  })

  await Promise.all([
    Blog.findByIdAndUpdate(
      { _id: blogId },
      {
        $push: { comments: newComment._id },
        $inc: {
          'activity.total_comments': 1,
          'activity.total_parent_comments': 1
        }
      }
    ),
    Notification.create({
      type: 'comment',
      blog: blogId,
      notification_for: blogAuthor,
      user: userId,
      comment: newComment._id
    })
  ])

  res.status(200).json({
    status: 'success',
    commentStatus: {
      comment: newComment.comment,
      commentedAt: newComment.commentedAt,
      _id: newComment._id,
      userId,
      children: newComment.children
    }
  })
})
