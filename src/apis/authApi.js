import axiosClient from './axiosClient'

const authApi = {
  login: (data) => {
    const url = '/api/auth/login'
    return axiosClient.post(url, data)
  },
  register: (data) => {
    const url = '/api/employee/register'
    return axiosClient.post(url, data)
  },
}

export default authApi
