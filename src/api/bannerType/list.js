import api from '@/utils/axiosInstance'

export const getBannerTypeList = async () => {
  try {
    const res = await api.get('api/banner-type-list/')
    return res.data // { status, message, data: [...] }
  } catch (error) {
    console.error('ERROR BANNER TYPE LIST:', error.response?.data || error)
    throw error.response?.data || error
  }
}
