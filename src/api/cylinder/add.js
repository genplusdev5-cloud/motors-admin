// src/api/cylinder/add.js
import api from '@/utils/axiosInstance'

const addCylinder = async payload => {
  try {
    const response = await api.post('api/cylinder-add/', payload)
    return response.data
  } catch (error) {
    console.error('Add cylinder error:', error.response?.data || error)
    throw error
  }
}

export default addCylinder
