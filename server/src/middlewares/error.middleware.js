import ApiError from '~/utils/ApiError'

const sendError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
}

// handle cast error in mongodb
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`

  return new ApiError(400, message)
}

// handle duplicate fields error in mongodb
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate field value: ${value}. Please use another value.`

  return new ApiError(400, message)
}

// error middleware
const errorMiddleware = (err, req, res, next) => {
  // set default error
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // log error
  console.log('--------------------')
  console.log('error dev: ', err)
  console.log('--------------------')

  // copy error
  let error = { ...err }
  error.message = err.message

  // handle error
  if (err.name === 'CastError') error = handleCastErrorDB(error)
  if (err.code === 11000) error = handleDuplicateFieldsDB(error)
  if (err.name === 'ValidationError') error = new ApiError(400, err.message)
  if (err.name === 'JsonWebTokenError')
    error = new ApiError(401, 'You are unauthenticated (invalid token')
  if (err.name === 'TokenExpiredError')
    error = new ApiError(401, 'You are unauthenticated (token expired)')

  // send error
  sendError(error, res)
}

export default errorMiddleware
