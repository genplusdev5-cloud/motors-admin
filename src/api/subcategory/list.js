import api from '@/utils/axiosInstance'

export const getSubCategoryList = async () => {
  const res = await api.get('api/subcategory-list/')
  return res.data
}
