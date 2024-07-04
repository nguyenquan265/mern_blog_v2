import { Router } from 'express'
import ApiError from '~/utils/ApiError'
const router = Router()

// import userRouter from './user.routes'

router.use('/check', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is running' })
})
// router.use('/users', userRouter)
router.all('*', (req, res, next) =>
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`))
)

export default router
