import api from '@/utils/axiosInstance'

export const insuranceUpdateApi = async (id, payload) => {
  const res = await api.put(`api/insurance-update/?id=${id}`, payload)
  return res.data
}
