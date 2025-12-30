import api from '@/utils/axiosInstance'

// Get privileges by role
export const getDealerPrivilege = async role_id => {
  const res = await api.get('/api/dealer/privilege/', {
    params: { role_id }
  })
  return res.data
}

// Update privileges
export const updateDealerPrivilege = async payload => {
  const res = await api.put('/api/dealer/privilege-update/', payload)
  return res.data
}
