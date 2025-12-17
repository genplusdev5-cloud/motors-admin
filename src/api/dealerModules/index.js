import api from '@/utils/axiosInstance'

export const getDealerModules = async () => {
  const res = await api.get('/api/dealer/modules/')
  return res.data
}
