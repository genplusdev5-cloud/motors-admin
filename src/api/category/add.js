import api from '@/utils/axiosInstance'

export const addCategory = async data => {
  const res = await api.post('api/category-add/', data)
  return res.data
}
