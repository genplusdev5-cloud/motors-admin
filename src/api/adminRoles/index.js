import api from '@/utils/axiosInstance'

// GET all roles
export const getAdminRole = async () => {
  const res = await api.get('api/admin/roles/')
  return res.data
}

// ADD role
export const addAdminRole = async payload => {
  const res = await api.post('api/admin/roles-add/', payload)
  return res.data
}

// UPDATE role
export const updateAdminRole = async (id, payload) => {
  const res = await api.put(`api/admin/roles-update/?id=${id}`, payload)
  return res.data
}

// DELETE role
export const deleteAdminRole = async id => {
  const res = await api.put('api/admin/roles-delete/', { id })
  return res.data
}

// DUPLICATE role
export const duplicateAdminRole = async payload => {
  const res = await api.post('api/admin/roles-duplicate/', payload)
  return res.data
}
