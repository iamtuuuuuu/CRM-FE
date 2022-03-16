import axiosClient from './axiosClient'

export const customerApi = {
  getAll: () => {
    const url = '/api/customer'
    return axiosClient.get(url)
  },
  getOne: (id) => {
    const url = `/api/customer/${id}`
    return axiosClient.get(url)
  },
  getCampaignOfCustomer: (id) => {
    const url = `/api/customer/campaign/${id}`
    return axiosClient.get(url)
  },
  addCampaignForCustomer: (customerId, campaignId) => {
    const url = `/api/customer/campaign/${customerId}/${campaignId}`
    return axiosClient.post(url)
  },
  editCampaignForCustomer: (id, data) => {
    const url = `/api/customer/campaign/${id}`
    return axiosClient.patch(url, data)
  },
  removeCampaignForCustomer: (customerId, campaignIds) => {
    const url = `/api/customer/delete-campaign/${customerId}`
    console.log('api:', campaignIds)
    return axiosClient.patch(url, { ids: campaignIds })
  },
  create: (data) => {
    const url = '/api/customer'
    return axiosClient.post(url, data)
  },
  update: (id, data) => {
    const url = `/api/customer/${id}`
    return axiosClient.patch(url, data)
  },
  sendMail: (id, data) => {
    const url = `/api/customer/send-mail/${id}`
    return axiosClient.post(url, data)
  },
  findMail: (id) => {
    const url = `/api/customer/send-mail/${id}`
    return axiosClient.get(url)
  },
  findProblem: (customerId) => {
    const url = `/api/customer/problem/${customerId}`
    return axiosClient.get(url)
  },
  addProblem: (customerId, data) => {
    const url = `/api/customer/problem/${customerId}`
    return axiosClient.post(url, data)
  },
  editProblem: (problemId, data) => {
    const url = `/api/customer/problem/${problemId}`
    return axiosClient.patch(url, data)
  },
}
