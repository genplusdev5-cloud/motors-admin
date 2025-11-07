// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getBodyType = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('/body-type-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addBodyType = async payload => {
  const res = await axiosInstance.post('/body-type-add/', payload)

  return res.data
}

// ✏️ Update
export const updateBodyType = async (id, payload) => {
  const res = await axiosInstance.put(`/body-type-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteBodyType = async id => {
  try {
    const res = await axiosInstance.put(`/body-type-delete/${id}`) // ✅ DELETE method

   console.log('🛰️ Deleting Body Type URL:', `/body-type-delete/${id}`)


    return res.data
  } catch (err) {
    console.error('Full delete error:', err)
    console.error('Error response data:', err.response?.data)
    throw new Error(err.response?.data?.message || 'Failed to delete body type due to a server error.')
  }
}
