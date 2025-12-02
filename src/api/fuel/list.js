import api from '@/utils/axiosInstance'

export const getFuelList = async () => {
  try {
    const response = await api.get('api/fuel-list/')
    return response.data // { status: "success", data: [...] }
  } catch (error) {
    console.error('Error fetching fuel types:', error.response?.data || error)
    throw error.response?.data || error
  }
}
