import api from '@/utils/axiosInstance'

export const steeringUpdate = (id, formData) => {
  return api.put(`/api/steering-update/?id=${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
