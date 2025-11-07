

import axiosInstance from '@/configs/token'

// 📦 Get All
export const getVehicle = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/vehicle-type-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addVehicle = async payload => {
  const res = await axiosInstance.post('api/vehicle-type-add/', payload)

  return res.data
}

// ✏️ Update
export const updateVehicle = async (id, payload) => {
  const res = await axiosInstance.put(`api/vehicle-type-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteVehicle = async id => {
  // 💡 CRITICAL FIX: The ID was missing from the URL.
  // The endpoint must include the ID of the resource to be deleted.
  // Assuming the correct API format for deletion is '/category-delete/{id}/'
  const res = await axiosInstance.delete(`api/vehicle-type-delete/${id}/`)

  return res.data
}
