import axiosClient from './axiosClient'

const campaignApi = {
  getAll: (params) => {
    const url = '/api/campaign/'
    return axiosClient.get(url, { params })
  },
  getCampaignStatus: () => {
    const url = '/api/campaign/status'
    return axiosClient.get(url)
  },
  getTasks: (id) => {
    const url = `/api/campaign/get-tasks/${id}`
    return axiosClient.get(url)
  },
  addTask: (id, data) => {
    const url = `/api/campaign/add-task/${id}`
    return axiosClient.post(url, data)
  },
  create: (data) => {
    const url = '/api/campaign/'
    return axiosClient.post(url, data)
  },
  update: (id, data) => {
    const url = `/api/campaign/${id}`
    return axiosClient.patch(url, data)
  },
  updateStatus: (campaignId, taskId) => {
    const url = `/api/campaign/change-status/${campaignId}/${taskId}`
    return axiosClient.patch(url)
  },
  findOne: (id) => {
    const url = `/api/campaign/${id}`
    return axiosClient.get(url)
  },
  deleteTasks: (id, data) => {
    const url = `/api/campaign/delete-tasks/${id}`
    return axiosClient.delete(url, { data })
  },
  remove: (id) => {
    const url = `/api/campaign/${id}`
    return axiosClient.delete(url)
  },
}

export default campaignApi
