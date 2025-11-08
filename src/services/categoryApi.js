// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getCategories = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/category-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addCategory = async payload => {
  const res = await axiosInstance.post('api/category-add/', payload)

  return res.data
}

// ✏️ Update
export const updateCategory = async (id, payload) => {
  const res = await axiosInstance.put(`api/category-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteCategory = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/category-delete/', formData)

  return res.data
}
