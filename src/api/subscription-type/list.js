import api from '@/utils/axiosInstance'

export const subscriptionTypeListApi = async () => {
  const res = await api.get('api/subscription-type-list/')
  return res.data
}
