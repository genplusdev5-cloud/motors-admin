import api from '@/utils/axiosInstance'

export const updateMileage = async (id, data) => {
  const response = await api.put(`api/mileage-update/${id}/`, data)
  return response.data
}
