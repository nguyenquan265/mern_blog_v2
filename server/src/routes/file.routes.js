import { Router } from 'express'
import { uploadByFile, uploadByURL } from '~/controllers/file.controller'
import uploadMiddleware from '~/middlewares/upload.middleware'

const router = Router()

router.post('/uploadByFile', uploadMiddleware.single('image'), uploadByFile)
router.post('/uploadByURL', uploadByURL)

export default router
