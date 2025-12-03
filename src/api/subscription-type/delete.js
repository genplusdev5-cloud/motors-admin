import api from '@/utils/axiosInstance'

export const subscriptionTypeDeleteApi = async id => {
  const res = await api.put('api/subscription-type-delete/', { id })
  return res.data
}
