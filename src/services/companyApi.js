import axiosInstance from '@/configs/token' // Adjust import path as needed

// Get Company Data
export const getCompanyData = async () => {
  const res = await axiosInstance.get('api/company/list/')
  const data = res.data?.data?.results?.[0] || res.data?.data || res.data

  if (Array.isArray(data)) return data[0] || {}

  return data || {}
}

// Update Company Data (PUT with FormData)
export const updateCompanyData = async (id, payload) => {
  try {
    const res = await axiosInstance.put(`api/company/update/${id}/`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return res.data
  } catch (error) {
    console.error('Error updating company data:', error)
    throw error
  }
}

// // 📦 Get Company Data (List/Read Operation)
// // Fetches the single company record to pre-fill the form
// export const getCompanyData = async () => {
//   const res = await axiosInstance.get('api/company/list/')

//   // This logic handles different API response structures and ensures an object is returned
//   const data = res.data?.data?.results?.[0] || res.data?.data || res.data

//   // Assuming the API returns a list of companies, we often take the first one
//   // or the response object directly if it's not wrapped in 'data' or 'results'.
//   if (Array.isArray(data)) {
//     return data[0] || {}
//   }

//   return data || {}
// }

// // ✏️ Update Company Data (Update Operation)
// // Sends the FormData payload (including files) to the API for the specific ID
// export const updateCompanyData = async (id, payload) => {
//   // Ensure payload is FormData when sending files.
//   const res = await axiosInstance.put(`api/company/update/${id}/`, payload)

//   return res.data
// }
