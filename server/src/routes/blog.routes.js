import { Router } from 'express'
import { uploadBanner } from '~/controllers/blog.controller'
import uploadMiddleware from '~/middlewares/upload.middleware'

const router = Router()

router.post('/uploadBanner', uploadMiddleware.single('banner'), uploadBanner)

export default router
