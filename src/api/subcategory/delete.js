import api from '@/utils/axiosInstance'

export const deleteSubCategory = async id => {
  const res = await api.put(`api/subcategory-delete/`, { id })
  return res.data
}
