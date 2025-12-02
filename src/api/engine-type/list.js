import api from '@/utils/axiosInstance'

export const getEngineTypeList = async () => {
  try {
    const response = await api.get('api/engine-type-list/')
    return response.data
    // { status: "success", data: [...] }
  } catch (error) {
    console.error('Error fetching engine types:', error.response?.data || error)
    throw error.response?.data || error
  }
}
