import api from '@/utils/axiosInstance'

export const bankUpdateApi = async (id, payload) => {
  const res = await api.put(`api/bank-update/?id=${id}`, payload)
  return res.data
}
