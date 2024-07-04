import 'dotenv/config'

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  BUILD_MODE: process.env.BUILD_MODE,
  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET
  }
}

export default env
