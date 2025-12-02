import api from '@/utils/axiosInstance'

export const deleteBannerType = async id => {
  try {
    const res = await api.put('api/banner-type-delete/', { id })
    return res.data
  } catch (error) {
    console.error('ERROR DELETE BANNER TYPE:', error.response?.data || error)
    throw error.response?.data || error
  }
}
