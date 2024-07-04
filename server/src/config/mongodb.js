import mongoose from 'mongoose'
import env from './env'

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI)

    console.log('MongoDB connected')
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

export default connectDB
