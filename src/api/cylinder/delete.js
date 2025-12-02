// src/api/cylinder/delete.js
import api from '@/utils/axiosInstance'

const deleteCylinder = async id => {
  try {
    // ID must be passed in body (backend design)
    const response = await api.put('api/cylinder-delete/', { id })
    return response.data
  } catch (error) {
    console.error('Delete Cylinder Error:', error.response?.data || error)
    throw error.response?.data || error
  }
}

export default deleteCylinder
