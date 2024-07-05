import axios from 'axios'

axios.defaults.withCredentials = true

const customAxios = axios.create({
  baseURL: 'http://localhost:8000/api/v1'
})

export default customAxios
