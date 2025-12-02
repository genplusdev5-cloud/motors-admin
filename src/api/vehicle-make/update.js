import api from '@/utils/axiosInstance'

export const updateVehicleMake = async (id, data) => {
  const res = await api.put(`api/make-update/${id}/`, data)
  return res.data
}
