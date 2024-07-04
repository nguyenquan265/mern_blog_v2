import { User } from '~/model'
import ApiError from '~/utils/ApiError'
import catchAsync from '~/utils/catchAsync'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { emailRegex, passwordRegex } from '~/utils/regex'
import env from '~/config/env'

const signAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.jwt.ACCESS_TOKEN_SECRET)
}

export const signup = catchAsync(async (req, res, next) => {
  const { fullname, email, password } = req.body
  const username = email.split('@')[0] + nanoid(5)

  // validate user input
  if (!fullname || !email || !password) {
    throw new ApiError(400, 'Please provide fullname, email and password')
  }

  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Please provide a valid email')
  }

  if (password.length < 6) {
    throw new ApiError(400, 'Password must be 6 letters long')
  }

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      'Password must be 6 to 20 chracters a with at least one numeric digit, one uppercase and one lowercase letter'
    )
  }

  const userExists = await User.exists({ 'personal_info.email': email })

  if (userExists) {
    throw new ApiError(400, 'User with this email already exists')
  }

  // return user
  const personal_info = { fullname, email, password, username }
  const user = await User.create({ personal_info })
  const accessToken = signAccessToken(user._id)
  delete user._doc.personal_info.password

  res
    .status(200)
    .json({ status: 'success', user: user.personal_info, accessToken })
})

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // validate user input
  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password')
  }

  const user = await User.findOne({ 'personal_info.email': email }).select(
    '+personal_info.password'
  )

  if (!user || !(await user.correctPassword(password))) {
    throw new ApiError(401, 'Incorrect email or password')
  }

  // return user
  const accessToken = signAccessToken(user._id)
  delete user._doc.personal_info.password

  res
    .status(200)
    .json({ status: 'success', user: user.personal_info, accessToken })
})
