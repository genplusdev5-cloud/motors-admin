import api from '@/utils/axiosInstance'

// GET privileges by role (you already had this)
export const getAdminPrivilege = async role_id => {
  const res = await api.get(`api/admin/privilege/?id=${role_id}`)
  return res.data
}

// UPDATE privileges (renamed to match our component)
export const updateAdminPrivilege = async payload => {
  const res = await api.put('api/admin/privilege-update/', payload)
  return res.data
}
