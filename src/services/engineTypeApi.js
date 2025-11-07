// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getEngineType  = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('/engine-type-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addEngineType = async payload => {
  const res = await axiosInstance.post('/engine-type-add/', payload)

  return res.data
}

// ✏️ Update
export const updateEngineType  = async (id, payload) => {
  const res = await axiosInstance.put(`/engine-type-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteEngineType  = async id => {
  try {
    const res = await axiosInstance.put(`/engine-type-delete/${id}`) // ✅ DELETE method

   console.log('🛰️ Deleting Body Type URL:', `/engine-type-delete/${id}`)


    return res.data
  } catch (err) {
    console.error('Full delete error:', err)
    console.error('Error response data:', err.response?.data)
    throw new Error(err.response?.data?.message || 'Failed to delete body type due to a server error.')
  }
}
