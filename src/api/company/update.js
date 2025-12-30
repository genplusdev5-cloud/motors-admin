import api from '@/utils/axiosInstance'

export const updateCompanyData = async (id, data) => {
  // Assuming the pattern api/company/update/${id}/ based on the list endpoint
  const res = await api.put(`api/company/update/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data?.data || res.data || {}
}
