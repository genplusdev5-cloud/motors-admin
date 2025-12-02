import api from '@/utils/axiosInstance'

export const deleteMileage = async id => {
  try {
    // Backend DELETE allow nahi kar raha → hum PUT use kar rahe hain
    const response = await api.put(`api/mileage-delete/`, { id })
    return response.data
  } catch (error) {
    console.error('Error deleting mileage:', error.response?.data || error)
    throw error.response?.data || { message: 'Delete failed' }
  }
}
