import api from '@/utils/axiosInstance'

export const insuranceAddApi = async payload => {
  const res = await api.post('api/insurance-add/', payload)
  return res.data
}
