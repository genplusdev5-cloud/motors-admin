

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
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/vehicle-type-delete/', formData)

  return res.data
}
