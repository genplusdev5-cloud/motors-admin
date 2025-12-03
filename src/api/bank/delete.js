import api from '@/utils/axiosInstance'

export const bankDeleteApi = async id => {
  const res = await api.put('api/bank-delete/', { id })
  return res.data
}
