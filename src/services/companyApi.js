// // ✅ src/services/companyApi.js
// import axiosInstance from '@/configs/token'

// // 📦 Get Single Company Data (List)
// export const getCompanyData = async () => {
//   try {
//     // Corrected endpoint based on typical Django REST Framework list/detail views
//     const res = await axiosInstance.get('/api/company/list/')

//     // Assuming the response for a single company setup is an array with one item,
//     // or the single item itself, potentially nested under 'data'.
//     const responseData = res.data?.data?.results || res.data?.data || res.data

//     // Return the first item if it's an array, otherwise the whole response data
//     return Array.isArray(responseData) ? responseData[0] : responseData || {}
//   } catch (err) {
//     console.error('Error fetching company data:', err)
//   }
// }

// // ✏️ Update Company Details
// /**
//  * Updates company data using FormData (supports file uploads).
//  * The component must ensure 'payload' is a FormData object.
//  * @param {number | string} id - The company ID.
//  * @param {FormData} payload - The FormData object containing fields and files.
//  * @returns {Promise<object>} The updated company data.
//  */
// export const updateCompanyData = async (id, payload) => {
//   try {
//     // Note: axios automatically sets the Content-Type header to 'multipart/form-data'
//     // with the correct boundary when a FormData object is provided as the body.
//     const res = await axiosInstance.put(`/api/company/update/${id}/`, payload)

//     return res.data
//   } catch (err) {
//     console.error('Error updating company data:', err.response?.data || err.message)

//     throw new Error(err.response?.data?.message || 'Failed to update company due to a server error.')
//   }
// }



// src/services/companyApi.js
import axiosInstance from '@/configs/token'

// 📦 Get Company Data (List/Read Operation)
// Fetches the single company record to pre-fill the form
export const getCompanyData = async () => {
  const res = await axiosInstance.get('api/company/list/')

  // This logic handles different API response structures and ensures an object is returned
  const data = res.data?.data?.results?.[0] || res.data?.data || res.data

  // Assuming the API returns a list of companies, we often take the first one
  // or the response object directly if it's not wrapped in 'data' or 'results'.
  if (Array.isArray(data)) {
    return data[0] || {}
  }

  return data || {}
}

// ✏️ Update Company Data (Update Operation)
// Sends the FormData payload (including files) to the API for the specific ID
export const updateCompanyData = async (id, payload) => {
  // Ensure payload is FormData when sending files.
  const res = await axiosInstance.put(`api/company/update/${id}/`, payload)

  return res.data
}


