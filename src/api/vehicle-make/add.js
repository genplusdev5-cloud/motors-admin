import api from '@/utils/axiosInstance'

export const addVehicleMake = async data => {
  const res = await api.post('api/make-add/', data)
  return res.data
}
