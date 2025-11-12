// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getBannerType = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/banner-type-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addBannerType = async payload => {
  const res = await axiosInstance.post('api/banner-type-add/', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return res.data
}

// ✏️ Update
export const updateBannerType = async (id, payload) => {
  const res = await axiosInstance.put(`api/banner-type-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteBannerType = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/banner-type-delete/', formData)

  return res.data
}
