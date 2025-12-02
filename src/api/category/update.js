import api from '@/utils/axiosInstance'

export const updateCategory = async (id, data) => {
  const res = await api.put(`api/category-update/${id}/`, data)
  return res.data
}
