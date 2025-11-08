// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getFuel = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/fuel-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addFuel = async payload => {
  const res = await axiosInstance.post('api/fuel-add/', payload)

  return res.data
}

// ✏️ Update
export const updateFuel= async (id, payload) => {
  const res = await axiosInstance.put(`api/fuel-update/${id}/`, payload)

  return res.data
}

// ❌ Delete
export const deleteFuel = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/fuel-delete/', formData)

  return res.data
}
