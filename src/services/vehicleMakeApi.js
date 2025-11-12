

// // ✅ src/services/categoryApi.js
// import axiosInstance from '@/configs/token'

// // 📦 Get All
// export const getMake = async () => {
//   // Corrected: Removed the payload argument from GET request
//   const res = await axiosInstance.get('api/make-list/')

//   // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
//   return res.data?.data?.results || res.data?.data || res.data || []
// }

// // ➕ Add
// export const addMake = async payload => {
//   const res = await axiosInstance.post('api/make-add/', payload, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   })

//   return res.data
// }

// // ✏️ Update
// export const updateMake = async (id, payload) => {
//   const res = await axiosInstance.put(`api/make-update/${id}/`, payload)

//   return res.data
// }

// // ❌ Delete

// export const deleteMake = async id => {
//   const formData = new FormData()

//   formData.append('id', id)

//   const res = await axiosInstance.put('api/make-delete/', formData)

//   return res.data
// }




// ✅ src/services/categoryApi.js
import axiosInstance from '@/configs/token'

// 📦 Get All
export const getMake = async () => {
  // Corrected: Removed the payload argument from GET request
  const res = await axiosInstance.get('api/make-list/')

  // Assuming data structure: { data: { results: [...] } } or just { data: [...] }
  return res.data?.data?.results || res.data?.data || res.data || []
}

// ➕ Add
export const addMake = async payload => {
  const res = await axiosInstance.post('api/make-add/', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return res.data
}

// ✏️ Update
export const updateMake = async (id, payload) => {
  // **FIXED**: Added headers for multipart/form-data consistency
  const res = await axiosInstance.put(`api/make-update/${id}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return res.data
}

// ❌ Delete

export const deleteMake = async id => {
  const formData = new FormData()

  formData.append('id', id)

  const res = await axiosInstance.put('api/make-delete/', formData)

  return res.data
}
