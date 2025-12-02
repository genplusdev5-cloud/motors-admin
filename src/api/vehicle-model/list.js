import api from '@/utils/axiosInstance'

export const getVehicleModelList = async () => {
  try {
    const res = await api.get('api/vehicle-model-list/')
    return res.data.data || []
  } catch (error) {
    console.error('ERROR VEHICLE MODEL LIST:', error.response?.data || error)
    throw error.response?.data || error
  }
}
