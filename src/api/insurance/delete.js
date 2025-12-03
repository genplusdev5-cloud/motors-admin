import api from '@/utils/axiosInstance'

export const insuranceDeleteApi = async id => {
  const res = await api.put('api/insurance-delete/', { id })
  return res.data
}
