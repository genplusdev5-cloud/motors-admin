// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getYear = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/year-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addYear = async payload => {
  const res = await axiosInstance.post('api/year-add/', payload)

  return res.data
}

// ✏️ Update
export const updateYear= async (id, payload) => {
  const res = await axiosInstance.put(`api/year-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteYear = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/year-delete/', formData)

  return res.data
}
