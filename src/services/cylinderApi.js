// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getCylinder = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/cylinder-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addCylinder = async payload => {
  const res = await axiosInstance.post('api/cylinder-add/', payload)

  return res.data
}

// ✏️ Update
export const updateCylinder = async (id, payload) => {
  const res = await axiosInstance.put(`api/cylinder-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteCylinder = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/cylinder-delete/', formData)

  return res.data
}
