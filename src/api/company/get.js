import api from '@/utils/axiosInstance'

export const getCompanyData = async () => {
  const res = await api.get('api/company/list/')
  
  // Postman shows data is an array: { status: "success", data: [...] }
  const companies = res.data?.data || []
  return companies.length > 0 ? companies[0] : {}
}
