import api from '@/utils/axiosInstance'

export const addBannerType = async formData => {
  try {
    const res = await api.post('api/banner-type-add/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error('ERROR ADD BANNER TYPE:', error.response?.data || error)
    throw error.response?.data || error
  }
}
