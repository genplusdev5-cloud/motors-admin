import api from '@/utils/axiosInstance'

export const addVehicleModel = async payload => {
  try {
    const res = await api.post('api/vehicle-model-add/', payload, {
      headers: { 'Content-Type': 'application/json' }
    })

    return res.data
  } catch (error) {
    console.error('ERROR ADD VEHICLE MODEL:', error.response?.data || error)
    throw error.response?.data || error
  }
}
