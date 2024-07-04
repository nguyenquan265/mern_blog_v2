import express from 'express'
import env from './config/env'
import connectDB from './config/mongodb'

const app = express()
app.listen(env.PORT, async () => {
  await connectDB()

  console.log(`Server running on port ${env.PORT}`)
})
