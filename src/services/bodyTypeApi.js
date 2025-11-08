// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getBodyType = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/body-type-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addBodyType = async payload => {
  const res = await axiosInstance.post('api/body-type-add/', payload)

  return res.data
}

// ✏️ Update
export const updateBodyType = async (id, payload) => {
  const res = await axiosInstance.put(`api/body-type-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteBodyType = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/body-type-delete/', formData)

  return res.data
}

