import api from '@/utils/axiosInstance'

export const updateBodyType = async (id, data) => {
  try {
    const response = await api.put(`api/body-type-update/${id}/`, data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
