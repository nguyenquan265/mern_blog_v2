import { Router } from 'express'
import ApiError from '~/utils/ApiError'
const router = Router()

import authRouter from './auth.routes'
import blogRouter from './blog.routes'
import userRouter from './user.routes'
import commentRouter from './comment.routes'

router.use('/check', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' })
})
router.use('/auth', authRouter)
router.use('/blogs', blogRouter)
router.use('/users', userRouter)
router.use('/comments', commentRouter)
router.all('*', (req, res, next) =>
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`))
)

export default router
