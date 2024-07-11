import { Router } from 'express'
import { getUserByUsername, searchUsers } from '~/controllers/user.controller'

const router = Router()

router.get('/search', searchUsers)
router.get('/profile/:username', getUserByUsername)

export default router
