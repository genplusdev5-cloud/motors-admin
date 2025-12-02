// src/api/vehicle-make/delete.js
import api from '@/utils/axiosInstance'

export const deleteVehicleMake = async id => {
  const res = await api.put('api/make-delete/', { id })
  return res.data
}
