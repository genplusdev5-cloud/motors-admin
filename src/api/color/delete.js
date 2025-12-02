import api from '@/utils/axiosInstance'

export const deleteColor = async id => {
  // Your backend uses PUT + body for delete
  const response = await api.put('api/color-delete/', { id })

  if (response.data.status === 'success') {
    return response.data
  }
  throw new Error(response.data.message || 'Failed to delete color')
}
