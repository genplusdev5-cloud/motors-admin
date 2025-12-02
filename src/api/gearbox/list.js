import api from '@/utils/axiosInstance'

// ⏬ Get all Gearbox records
export const getGearbox = async () => {
  const res = await api.get('api/gearbox-list/')
  return res.data?.data || []
}
