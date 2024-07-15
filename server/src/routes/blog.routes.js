import { Router } from 'express'
import {
  addComment,
  createBlog,
  getBlogBySlug,
  getLatestBlogs,
  getTrendingBlogs,
  likeBlog,
  searchBlogs,
  uploadImage
} from '~/controllers/blog.controller'
import { protect } from '~/middlewares/auth.middleware'
import uploadMiddleware from '~/middlewares/upload.middleware'

const router = Router()

router.get('/search', searchBlogs)
router.get('/latestBlogs', getLatestBlogs)
router.get('/trendingBlogs', getTrendingBlogs)
router.get('/getBlogBySlug/:slug', getBlogBySlug)

router.use(protect)
router.post('/uploadImage', uploadMiddleware.single('image'), uploadImage)
router.post('/createBlog', createBlog)
router.patch('/likeBlog', likeBlog)
router.post('/addComment', addComment)

export default router
