import api from '@/utils/axiosInstance'

// Fetch Roles
export const getDealerRole = async () => {
  const res = await api.get('/api/dealer/roles/')
  return res.data
}

// Add Role
export const addDealerRole = async payload => {
  const res = await api.post('/api/dealer/roles-add/', payload)
  return res.data
}

// Update Role
export const updateDealerRole = async (id, payload) => {
  const res = await api.put(`/api/dealer/roles-update/?id=${id}`, payload)
  return res.data
}

// Delete Role
export const deleteDealerRole = async id => {
  const res = await api.put('/api/dealer/roles-delete/', { id })
  return res.data
}

// Duplicate Role
export const duplicateDealerRole = async id => {
  const res = await api.post('/api/dealer/roles-duplicate/', { id })
  return res.data
}
