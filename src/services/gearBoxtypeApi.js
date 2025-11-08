// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getGearbox = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/gearbox-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addGearbox = async payload => {
  const res = await axiosInstance.post('api/gearbox-add/', payload)

  return res.data
}

// ✏️ Update
export const updateGearbox = async (id, payload) => {
  const res = await axiosInstance.put(`api/gearbox-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteGearBox = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/gearbox-delete/', formData)

  return res.data
}
