import { Router } from 'express'
import { createBlog, uploadImage } from '~/controllers/blog.controller'
import { protect } from '~/middlewares/auth.middleware'
import uploadMiddleware from '~/middlewares/upload.middleware'

const router = Router()

router.use(protect)
router.post('/uploadImage', uploadMiddleware.single('image'), uploadImage)
router.post('/createBlog', createBlog)

export default router
