// src/services/vehicleMakeApi.js
import axiosInstance from '@/configs/token'

/**
 * Helper function to prepare payload as FormData if a File object is detected.
 * Necessary for API endpoints that accept image uploads (multipart/form-data).
 */
const preparePayload = data => {
  // Check if any value in the data object is a File instance
  const hasFile = Object.values(data).some(value => value instanceof File)

  // If no File object is present, return the data as is (axios will send as JSON)
  if (!hasFile) {
    return data
  }

  // If a file is present, create and populate FormData
  const formData = new FormData()

  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      // Append File objects directly
      if (data[key] instanceof File) {
        // The third argument is the filename, which is optional but good practice
        formData.append(key, data[key], data[key].name)
      }

      // Handle array data or complex objects by stringifying (if necessary)
      else if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
        formData.append(key, JSON.stringify(data[key]))
      }

      // Append other data (strings, numbers, booleans)
      else {
        // Convert numbers/booleans to string as FormData only accepts strings or Blobs/Files
        formData.append(key, String(data[key]))
      }
    }
  }

  return formData
}

// 📦 Get All
export const getMake = async () => {
  const res = await axiosInstance.get('api/make-list/')

  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addMake = async payload => {
  // Use the helper to prepare payload as FormData if an image is included
  const finalPayload = preparePayload(payload)

  // When sending FormData, axios automatically sets the Content-Type to multipart/form-data
  const res = await axiosInstance.post('api/make-add/', finalPayload)

  return res.data
}

// ✏️ Update
export const updateMake = async (id, payload) => {
  // Use the helper to prepare payload as FormData if an image is included
  const finalPayload = preparePayload(payload)

  // When sending FormData, axios automatically sets the Content-Type to multipart/form-data
  const res = await axiosInstance.put(`api/make-update/${id}/`, finalPayload)

  return res.data
}

// ❌ Delete
export const deleteMake = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/make-delete/', formData)

  return res.data
}
