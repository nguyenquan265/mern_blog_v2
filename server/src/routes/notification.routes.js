import { Router } from 'express'
import { newNotifications } from '~/controllers/notification.controller'
import { protect } from '~/middlewares/auth.middleware'

const router = Router()

router.use(protect)
router.get('/newNotifications', newNotifications)

export default router
