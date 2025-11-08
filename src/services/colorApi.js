// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getColor = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/color-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addColor = async payload => {
  const res = await axiosInstance.post('api/color-add/', payload)

  return res.data
}

// ✏️ Update
export const updateColor = async (id, payload) => {
  const res = await axiosInstance.put(`api/color-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteColor = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/color-delete/', formData)

  return res.data
}
