import api from '@/utils/axiosInstance'

export const getCategoryList = async () => {
  return await api.get('api/category-list/');
};

