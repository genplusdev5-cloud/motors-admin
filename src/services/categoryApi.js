// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getCategories = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('/category-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addCategory = async payload => {
  const res = await axiosInstance.post('/category-add/', payload)

  return res.data
}

// ✏️ Update
export const updateCategory = async (id, payload) => {
  const res = await axiosInstance.put(`/category-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteCategory = async id => {
  // 💡 CRITICAL FIX: The ID was missing from the URL.
  // The endpoint must include the ID of the resource to be deleted.
  // Assuming the correct API format for deletion is '/category-delete/{id}/'
  const res = await axiosInstance.delete(`/category-delete/${id}/`)

  return res.data
}
