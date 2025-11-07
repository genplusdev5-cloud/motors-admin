// src/services/subCategoryApi.js (or wherever your file is located)
import axiosInstance from '@/configs/token' // Assuming this correctly handles your authentication token

// 📦 Get All SubCategories
export const getSubCategories = async () => {
  const res = await axiosInstance.get('/features-list/')

  // Adjust the return structure based on your API response
  return res.data?.data || res.data || []
}

// 📦 Get All Categories (Included for completeness, often needed in the modal)
// 💡 FIXED: Renamed from getCategoriess to getCategories
export const getCategories = async () => {
  const res = await axiosInstance.get('/category-list/') // ✅ correct endpoint

  console.log('category list response:', res)

  // This ensures we get the array of categories
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add SubCategory
export const addSubCategory = async payload => {
  // NOTE: Assuming the add endpoint is /subcategory-add/
  const res = await axiosInstance.post('/features-add/', payload)

  return res.data
}

// ✏️ Update SubCategory
export const updateSubCategory = async (id, payload) => {
  // NOTE: Assuming the update endpoint is /subcategory-update/{id}/
  const res = await axiosInstance.put(`/features-update/${id}/`, payload)

  return res.data
}

// ❌ Delete SubCategory
export const deleteSubCategory = async id => {
  // NOTE: Assuming the delete endpoint is /subcategory-delete/{id}/
  const res = await axiosInstance.delete(`/features-delete/${id}/`)

  return res.data
}
