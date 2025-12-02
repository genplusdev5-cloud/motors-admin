import api from '@/utils/axiosInstance'

export const updateSubCategory = async (id, data) => {
  const res = await api.put(`api/subcategory-update/${id}/`, data)
  return res.data
}
