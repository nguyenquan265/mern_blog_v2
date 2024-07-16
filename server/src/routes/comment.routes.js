import { Router } from 'express'
import {
  deleteComment,
  getBlogComments
} from '~/controllers/comment.controller'
import { protect } from '~/middlewares/auth.middleware'

const router = Router()

router.get('/getBlogComments', getBlogComments)

router.use(protect)
router.delete('/deleteComment/:commentId', deleteComment)

export default router
