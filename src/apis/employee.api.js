import axiosClient from './axiosClient'

const employeeApi = {
  getMe: () => {
    const url = '/api/employee/profile'
    return axiosClient.get(url)
  },
  getAllEmployee: () => {
    const url = '/api/employee'
    return axiosClient.get(url)
  },
  editEmployee: (id, data) => {
    const url = `/api/employee/edit-employee/${id}`
    return axiosClient.patch(url, data)
  },
}

export default employeeApi
