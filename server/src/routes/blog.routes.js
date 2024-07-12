import { Router } from 'express'
import {
  createBlog,
  getBlogBySlug,
  getLatestBlogs,
  getTrendingBlogs,
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

export default router
