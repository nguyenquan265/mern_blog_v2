import { Router } from 'express'
import {
  getMe,
  googleAuth,
  signin,
  signup
} from '~/controllers/auth.controller'
import { protect } from '~/middlewares/auth.middleware'

const router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', googleAuth)
router.get('/me', protect, getMe)

export default router
