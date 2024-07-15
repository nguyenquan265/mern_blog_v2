import { Router } from 'express'
import { getBlogComments } from '~/controllers/comment.controller'

const router = Router()

router.get('/getBlogComments', getBlogComments)

export default router
