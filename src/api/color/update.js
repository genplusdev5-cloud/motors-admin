import api from '@/utils/axiosInstance'

export const updateColor = async (id, colorData) => {
  try {
    const response = await api.put(`api/color-update/${id}/`, colorData)
    // Some APIs return { status: 'success' }, some just data
    if (response.data.status === 'success' || response.status === 200) {
      return response.data
    }
    throw new Error(response.data.message || 'Failed to update color')
  } catch (error) {
    console.error('Update color error:', error.response?.data || error.message)
    throw error.response?.data || error
  }
}
