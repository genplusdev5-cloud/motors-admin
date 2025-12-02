import api from '@/utils/axiosInstance'

// ⏫ Add new Gearbox
export const addGearbox = async payload => {
  const res = await api.post('api/gearbox-add/', payload)
  return res.data
}
