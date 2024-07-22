import { Router } from 'express'
import {
  getNotifications,
  newNotifications
} from '~/controllers/notification.controller'
import { protect } from '~/middlewares/auth.middleware'

const router = Router()

router.use(protect)
router.get('/', getNotifications)
router.get('/notificationsStatus', newNotifications)

export default router
