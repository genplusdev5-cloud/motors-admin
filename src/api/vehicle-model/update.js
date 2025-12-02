import api from '@/utils/axiosInstance'

export const updateVehicleModel = async (id, payload) => {
  try {
    const res = await api.put(`api/vehicle-model-update/${id}/`, payload, {
      headers: { 'Content-Type': 'application/json' }
    })

    return res.data
  } catch (error) {
    console.error('ERROR UPDATE VEHICLE MODEL:', error.response?.data || error)
    throw error.response?.data || error
  }
}
