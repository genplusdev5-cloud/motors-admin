import api from '@/utils/axiosInstance'

export const deleteCategory = async id => {
  const res = await api.put('api/category-delete/', { id })
  return res.data
}
