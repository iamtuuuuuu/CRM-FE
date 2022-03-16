import axiosClient from './axiosClient'

const departmentApi = {
  getAll: () => {
    const url = '/api/department'
    return axiosClient.get(url)
  },
  addDepartment: (data) => {
    const url = '/api/department'
    return axiosClient.post(url, data)
  },
  editDepartment: (id, data) => {
    const url = `/api/department/${id}`
    return axiosClient.patch(url, data)
  },
  delete: (data) => {
    const url = '/api/department/delete'
    return axiosClient.delete(url, { data })
  },
}

export default departmentApi
