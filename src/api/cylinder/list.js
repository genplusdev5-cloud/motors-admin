// src/api/cylinder/list.js
import api from '@/utils/axiosInstance'

const getCylinderList = async () => {
  try {
    const response = await api.get('api/cylinder-list/')
    return response.data   // { status, message, data: [...] }
  } catch (error) {
    console.error("Cylinder list error:", error.response?.data || error)
    throw error
  }
}

export default getCylinderList
