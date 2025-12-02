import api from '@/utils/axiosInstance'

// ❌ Delete / deactivate Gearbox
export const deleteGearBox = async id => {
  const res = await api.put('api/gearbox-delete/', { id })
  return res.data
}
