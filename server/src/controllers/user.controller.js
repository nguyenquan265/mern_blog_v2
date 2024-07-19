import { User } from '~/model'
import ApiError from '~/utils/ApiError'
import catchAsync from '~/utils/catchAsync'
import { passwordRegex } from '~/utils/regex'
import bcryptjs from 'bcryptjs'

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

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'All fields are required!')
  }

  if (!passwordRegex.test(newPassword)) {
    throw new ApiError(
      400,
      'Password must contain at least one number, one uppercase and lowercase letter, and at least 6 or more characters'
    )
  }

  const user = await User.findById(req.user._id).select(
    '+personal_info.password'
  )

  if (user.google_auth) {
    throw new ApiError(
      400,
      'You cant change password if you signed up with google'
    )
  }

  if (!(await user.correctPassword(currentPassword))) {
    throw new ApiError(401, 'Incorrect password')
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 12)
  user.personal_info.password = hashedPassword
  await user.save()

  res.status(200).json({ status: 'success' })
})
