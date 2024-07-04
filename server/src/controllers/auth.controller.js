import catchAsync from '~/utils/catchAsync'

export const signup = catchAsync(async (req, res, next) => {
  const { fullname, email, password } = req.body

  res.status(200).json({ status: 'success' })
})
