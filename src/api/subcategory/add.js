import api from '@/utils/axiosInstance'

export const addSubCategory = async data => {
  const res = await api.post('api/subcategory-add/', data)
  return res.data
}
