import api from '@/utils/axiosInstance'

export const insuranceListApi = async () => {
  const res = await api.get('api/insurance-list/')
  return res.data
}
