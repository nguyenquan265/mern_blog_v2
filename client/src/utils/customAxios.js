import axios from 'axios'
import { getFromSession } from './session'

axios.defaults.withCredentials = true

const customAxios = axios.create({
  baseURL: 'http://localhost:8000/api/v1'
})

customAxios.interceptors.request.use(
  (config) => {
    const token = getFromSession('accessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default customAxios
