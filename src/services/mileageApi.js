// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getMileage = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/mileage-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addMileage  = async payload => {
  const res = await axiosInstance.post('api/mileage-add/', payload)

  return res.data
}

// ✏️ Update
export const updateMileage  = async (id, payload) => {
  const res = await axiosInstance.put(`api/mileage-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteMileage  = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/mileage-delete/', formData)

  return res.data
}
