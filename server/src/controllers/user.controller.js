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

export const updateUserProfileImage = catchAsync(async (req, res, next) => {
  const { profile_img } = req.body

  const user = await User.findById(req.user._id)

  user.personal_info.profile_img = profile_img

  await user.save()

  res.status(200).json({ status: 'success', user: user.personal_info })
})

export const updateUserProfile = catchAsync(async (req, res, next) => {
  const { username, bio, social_links } = req.body

  if (username.length < 3) {
    throw new ApiError(400, 'Username must be at least 3 characters long')
  }

  // Check if username is already taken
  const userWithUsername = await User.findOne({
    'personal_info.username': username
  })

  if (
    userWithUsername &&
    userWithUsername._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(400, 'Username is already taken')
  }

  if (bio.length > 150) {
    throw new ApiError(400, 'Bio must be less than 150 characters')
  }

  // Get the social links keys
  const socialLinksArr = Object.keys(social_links)

  // Loop through the social links
  for (let i = 0; i < socialLinksArr.length; i++) {
    // Check if the social link is not empty
    if (social_links[socialLinksArr[i]].length) {
      const hostname = new URL(social_links[socialLinksArr[i]]).hostname // Get the hostname of the social link

      if (
        !hostname.includes(`${socialLinksArr[i]}.com`) && // Check if the hostname includes the social media platform
        socialLinksArr[i] !== 'website' // Check if the social media platform is not a normal website
      ) {
        throw new ApiError(
          400,
          'Invalid social link, you can only add links from supported social media platforms with the correct format ( https://www.example.com )'
        )
      }
    }
  }

  const dataObj = {
    'personal_info.username': username,
    'personal_info.bio': bio,
    social_links
  }

  const user = await User.findByIdAndUpdate(req.user._id, dataObj, {
    new: true
  }).select('-google_auth -blogs -updatedAt -account_info')

  res
    .status(200)
    .json({ status: 'success', user, userPersonalInfo: user.personal_info })
})
