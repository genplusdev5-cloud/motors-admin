import api from '@/utils/axiosInstance'

export const getCompanyData = async () => {
  const res = await api.get('api/company/list/')
  // ✅ IMPORTANT FIX
  return res.data?.data?.[0] || {}
}
