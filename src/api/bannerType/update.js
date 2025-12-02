import api from '@/utils/axiosInstance'

export const updateBannerType = async (id, formData) => {
  try {
    const res = await api.put(`api/banner-type-update/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return res.data
  } catch (error) {
    console.error('ERROR UPDATE BANNER TYPE:', error.response?.data || error)
    throw error.response?.data || error
  }
}
