import axios from 'axios'
import router from '../router/index'

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
})

api.interceptors.response.use(null, (error) => {
    console.log(error)
    if (error.response.status === 401) {
      console.log('Error on Authorization')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push({name: 'Login'})
      router.go()
    }
    return Promise.reject(error)
  })

export default api