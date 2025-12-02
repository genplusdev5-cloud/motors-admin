import api from '@/utils/axiosInstance'

export const addFuel = async payload => {
  try {
    const response = await api.post('api/fuel-add/', payload);
    return response.data; // { status: "success", message: "...", data: {...} }
  } catch (error) {
    console.error('Error adding fuel type:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

