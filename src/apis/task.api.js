import axiosClient from './axiosClient'

const taskApi = {
  getAllTask: () => {
    const url = '/api/task'
    return axiosClient.get(url)
  },
  createTask: (data) => {
    const url = '/api/task'
    return axiosClient.post(url, data)
  },
  getTask: (id) => {
    const url = `/api/task/${id}`
    return axiosClient.get(url)
  },
  updateTask: (id, data) => {
    const url = `/api/task/${id}`
    return axiosClient.patch(url, data)
  },
  deleteTasks: (data) => {
    const url = '/api/task/delete'
    return axiosClient.delete(url, { data })
  },
}

export default taskApi
