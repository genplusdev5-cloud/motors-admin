import api from '@/utils/axiosInstance'

export const subscriptionTypeAddApi = async payload => {
  const res = await api.post('api/subscription-type-add/', payload)
  return res.data
}
