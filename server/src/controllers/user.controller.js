import { User } from '~/model'
import ApiError from '~/utils/ApiError'
import catchAsync from '~/utils/catchAsync'

export const searchUsers = catchAsync(async (req, res, next) => {
  const { query } = req.query

  const users = await User.find({
    'personal_info.username': { $regex: query, $options: 'i' }
  }).select(
    'personal_info.fullname personal_info.username personal_info.profile_img -_id'
  )

  res.status(200).json({ status: 'success', users })
})

export const getUserByUsername = catchAsync(async (req, res, next) => {
  const { username } = req.params

  const user = await User.findOne({
    'personal_info.username': username
  }).select('-google_auth -blogs -updatedAt')

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.status(200).json({ status: 'success', user })
})
