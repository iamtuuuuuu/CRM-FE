import axiosClient from './axiosClient'

const productApi = {
  getAllProduct: () => {
    const url = '/api/product'
    return axiosClient.get(url)
  },
  createProduct: (data) => {
    const url = '/api/product'
    return axiosClient.post(url, data)
  },
  getProduct: (id) => {
    const url = `/api/product/${id}`
    return axiosClient.get(url)
  },
  updateProduct: (id, data) => {
    const url = `/api/product/${id}`
    return axiosClient.patch(url, data)
  },
  deleteProduct: (id) => {
    const url = `/api/product/${id}`
    return axiosClient.delete(url)
  },
  getTasksOfProduct: (id) => {
    const url = `/api/product/get-tasks/${id}`
    return axiosClient.get(url)
  },
  addTaskForProduct: (productId, data) => {
    const url = `/api/product/add-task/${productId}`
    return axiosClient.post(url, data)
  },
  deleteTasks: (productId, data) => {
    const url = `/api/product/delete-task/${productId}`
    return axiosClient.delete(url, { data })
  },
}

export default productApi
