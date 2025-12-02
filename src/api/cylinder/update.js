// src/api/cylinder/update.js
import api from '@/utils/axiosInstance'

const updateCylinder = async (id, payload) => {
  try {
    const response = await api.put(`api/cylinder-update/${id}/`, payload)
    return response.data
  } catch (error) {
    console.error('Update cylinder error:', error.response?.data || error)
    throw error
  }
}

export default updateCylinder
