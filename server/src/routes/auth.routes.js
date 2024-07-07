import { Router } from 'express'
import {
  getMe,
  googleAuth,
  signin,
  signup
} from '~/controllers/auth.controller'

const router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', googleAuth)
router.get('/me', getMe)

export default router
