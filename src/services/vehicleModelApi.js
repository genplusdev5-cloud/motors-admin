// src/services/subCategoryApi.js (or wherever your file is located)
import axiosInstance from '@/configs/token' // Assuming this correctly handles your authentication token

// 📦 Get All SubCategories
export const getVehicleModel = async () => {
  const res = await axiosInstance.get('api/vehicle-model-list/') // Adjust the return structure based on your API response

  return res.data?.data || res.data || []
}

// dropdown----------------------------------------------------------------------------------------------------

export const getCategories = async () => {
  const res = await axiosInstance.get('api/category-list/') // ✅ correct endpoint

  console.log('category list response:', res) // This ensures we get the array of categories

  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getSubCategories = async () => {
  const res = await axiosInstance.get('api/subcategory-list/') // ✅ correct endpoint

  console.log('subcategory list response:', res) // This ensures we get the array of categories

  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getCylinder = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/cylinder-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getVehicleMake = async () => {
  const res = await axiosInstance.get('api/make-list/') // ✅ correct endpoint

  console.log('make list response:', res) // This ensures we get the array of categories

  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getVehicleType = async () => {
  const res = await axiosInstance.get('api/vehicle-type-list/') // ✅ correct endpoint

  console.log('vehicle type list response:', res) // This ensures we get the array of categories

  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getBodyType = async () => {
  const res = await axiosInstance.get('api/body-type-list/') // ✅ correct endpoint

  console.log('body type list response:', res) // This ensures we get the array of categories

  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getEngineType = async () => {
  const res = await axiosInstance.get('api/engine-type-list/') // ✅ correct endpoint

  console.log('engine list response:', res) // This ensures we get the array of categories

  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getFuel = async () => {
  const res = await axiosInstance.get('api/fuel-list/') // ✅ correct endpoint

  console.log('fuel list response:', res) // This ensures we get the array of categories

  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getGearBox = async () => {
  const res = await axiosInstance.get('api/gearbox-list/') // ✅ correct endpoint

  console.log('gearbox list response:', res) // This ensures we get the array of categories

  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getColor = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/color-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

export const getMileage = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/mileage-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// dropdown api end------------------------------------------------------------------------

// ➕ Add model
export const addVehicleModel = async payload => {
  // NOTE: Assuming the add endpoint is /subcategory-add/
  const res = await axiosInstance.post('api/vehicle-model-add/', payload)

  return res.data
}

// ✏️ Update model
export const updateVehicleModel = async (id, payload) => {
  // NOTE: Assuming the update endpoint is /subcategory-update/{id}/
  const res = await axiosInstance.put(`api/vehicle-model-update/${id}/`, payload)

  return res.data
}

// ❌ Delete SubCategory
export const deleteVehicleModel = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/vehicle-model-delete/', formData)

  return res.data
}



// ----------------------------------------------------------------------------


