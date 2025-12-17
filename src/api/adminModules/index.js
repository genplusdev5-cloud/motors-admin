import api from '@/utils/axiosInstance'

export const getAdminModules = async () => {
  const res = await api.get('api/admin/modules/')
  return res.data
}

