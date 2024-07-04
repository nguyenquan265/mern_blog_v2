import express from 'express'
import env from './config/env'
import connectDB from './config/mongodb'
import router from './routes'
import errorMiddleware from './middlewares/error.middleware'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1', router)
app.use(errorMiddleware)

if (env.BUILD_MODE === 'prod') {
  app.listen(process.env.PORT, async () => {
    await connectDB()

    console.log(`Pro: Server is running on port ${process.env.PORT}`)
  })
} else {
  app.listen(env.PORT, async () => {
    await connectDB()

    console.log(`Dev: Server is running on port ${env.PORT}`)
  })
}
