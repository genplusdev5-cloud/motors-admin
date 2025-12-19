import api from '@/utils/axiosInstance'

// ✅ GET privileges by role (FIXED)
export const getAdminPrivilege = async role_id => {
  const res = await api.get('api/admin/privilege/', {
    params: { role_id: role_id }
  })
  return res.data
}

// UPDATE privileges (OK already)
export const updateAdminPrivilege = async payload => {
  const res = await api.put('api/admin/privilege-update/', payload)
  return res.data
}
