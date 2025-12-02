import api from '@/utils/axiosInstance'

export const getVehicleMakeList = async () => {
  const res = await api.get('api/make-list/')
  return res.data
}
