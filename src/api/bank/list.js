import api from '@/utils/axiosInstance'

export const bankListApi = async () => {
  const res = await api.get('api/bank-list/')
  return res.data
}
