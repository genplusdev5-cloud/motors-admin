import api from '@/utils/axiosInstance'

// ✏️ Update existing Gearbox
export const updateGearbox = async (id, payload) => {
  const res = await api.put(`api/gearbox-update/${id}/`, payload)
  return res.data
}
