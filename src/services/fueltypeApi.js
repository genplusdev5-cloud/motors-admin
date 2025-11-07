// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getFuel = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/fuel-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addFuel = async payload => {
  const res = await axiosInstance.post('api/fuel-add/', payload)

  return res.data
}

// ✏️ Update
export const updateFuel= async (id, payload) => {
  const res = await axiosInstance.put(`api/fuel-update/${id}/`, payload)

  return res.data
}

// ❌ Delete

export const deleteFuel = async id => {
  try {
    // The endpoint is correct for a Django-like REST framework
    const res = await axiosInstance.delete(`api/fuel-delete/${id}/`);

    console.log('Delete response:', res.data);

    return res.data;
  } catch (err) {
    // Enhanced error logging to understand the failure
    console.error('Full delete error:', err);
    console.error('Error response data:', err.response?.data);

    // Throw a custom error message, prioritizing the message from the backend
    throw new Error(err.response?.data?.message || 'Failed to delete color due to a server error.');
  }
};
