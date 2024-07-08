import express from 'express'
import cors from 'cors'
import env from './config/env'
import connectDB from './config/mongodb'
import router from './routes'
import errorMiddleware from './middlewares/error.middleware'
import corsOptions from './config/cors'
import admin from 'firebase-admin'
import serviceAccount from './config/blog-v2-fe257-firebase-adminsdk-8f6tu-37d6c7ca32.json'

const app = express()
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

app.use(cors(corsOptions))
app.use(express.json({ limit: '2mb' }))
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
