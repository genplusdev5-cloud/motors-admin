import api from '@/utils/axiosInstance'

export const deleteFuel = async id => {
  try {
    const response = await api.put('api/fuel-delete/', { id });
    return response.data;
  } catch (error) {
    console.error('Error deleting fuel type:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

