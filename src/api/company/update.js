import api from '@/utils/axiosInstance'

// UPDATE Company details
export const updateCompanyData = async (id, payload) => {
  const res = await api.put(`api/company/update/${id}/`, payload, {
  })
  return res.data
}
