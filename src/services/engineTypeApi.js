// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getEngineType  = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/engine-type-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addEngineType = async payload => {
  const res = await axiosInstance.post('api/engine-type-add/', payload)

  return res.data
}

// ✏️ Update
export const updateEngineType  = async (id, payload) => {
  const res = await axiosInstance.put(`api/engine-type-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteEngineType = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/engine-type-delete/', formData)

  return res.data
}
