import { Router } from 'express'
import { uploadBanner } from '~/controllers/blog.controller'
import uploadMiddleware from '~/middlewares/upload.middleware'

const router = Router()

router.post('/upload', uploadMiddleware.single('banner'), uploadBanner)

export default router
