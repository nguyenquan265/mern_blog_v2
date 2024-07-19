import { Router } from 'express'
import {
  changePassword,
  getUserByUsername,
  searchUsers
} from '~/controllers/user.controller'
import { protect } from '~/middlewares/auth.middleware'

const router = Router()

router.get('/search', searchUsers)
router.get('/profile/:username', getUserByUsername)

router.use(protect)
router.patch('/changePassword', changePassword)

export default router
