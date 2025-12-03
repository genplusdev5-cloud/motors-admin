import api from '@/utils/axiosInstance'

export const bankAddApi = async payload => {
  const res = await api.post('api/bank-add/', payload)
  return res.data
}
