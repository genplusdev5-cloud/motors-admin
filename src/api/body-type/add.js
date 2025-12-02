import api from '@/utils/axiosInstance'

export const addBodyType = async data => {
  try {
    const response = await api.post('api/body-type-add/', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
