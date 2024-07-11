import { User } from '~/model'
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
