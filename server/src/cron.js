import { CronJob } from 'cron'
import https from 'https'
import http from 'http'
import { env } from './config/env'

const URL = 'http://localhost:8000/api/v1/check'
let job

if (env.BUILD_MODE === 'prod') {
  job = new CronJob('*/14 * * * *', function () {
    https
      .get(URL, (res) => {
        if (res.statusCode === 200) {
          console.log('GET request sent successfully')
        } else {
          console.log('GET request failed', res.statusCode)
        }
      })
      .on('error', (e) => {
        console.error('Error while sending request', e)
      })
  })
} else {
  job = new CronJob('*/14 * * * *', function () {
    http
      .get(URL, (res) => {
        if (res.statusCode === 200) {
          console.log('GET request sent successfully')
        } else {
          console.log('GET request failed', res.statusCode)
        }
      })
      .on('error', (e) => {
        console.error('Error while sending request', e)
      })
  })
}

export default job
