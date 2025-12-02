import api from '@/utils/axiosInstance'

export const getBodyTypeList = async () => {
  try {
    const response = await api.get('api/body-type-list/')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
