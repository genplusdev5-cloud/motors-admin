// 'use client'

// import { useState, useEffect } from 'react'

// import Grid from '@mui/material/Grid2'
// import Dialog from '@mui/material/Dialog'
// import Button from '@mui/material/Button'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import DialogActions from '@mui/material/DialogActions'
// import Divider from '@mui/material/Divider'
// import { styled, useTheme } from '@mui/material/styles'
// import { MenuItem, Typography } from '@mui/material'

// import DialogCloseButton from './closebtn'
// import CustomTextField from '@core/components/mui/TextField'
// import FileUploaderSingle from './FileUploaderSingle' // Assuming this path is correct

// // Label component with red star for required fields
// const LabelWithStar = styled('span')({
//   '&::before': {
//     content: '"*"',
//     color: 'red',
//     marginRight: 4
//   }
// })

// const AddModalWindow = ({ open, setOpen, onSaveCategory, editingRow }) => {
//   const theme = useTheme()

//   // Default form state
//   const [data, setData] = useState({
//     name: '',
//     image: null,
//     description: '',
//     is_active: 1
//   })

//   const [isEdit, setIsEdit] = useState(false)

//   // const [touched, setTouched] = useState({}) // Not used in the provided code

//   // Load data when editing
//   useEffect(() => {
//     if (editingRow) {
//       setData({
//         name: editingRow.name || '',
//         image: editingRow.image || '',
//         description: editingRow.description || '',

//         // Map any truthy/falsy value to 1 or 0 for the dropdown
//         is_active: editingRow.is_active === 1 || editingRow.is_active === true ? 1 : 0
//       })
//       setIsEdit(true)
//     } else {
//       // Reset for Add mode
//       setData({ name: '', description: '', is_active: 1 })
//       setIsEdit(false)
//     }
//   }, [editingRow, open])

//   const handleClose = () => {
//     // Reset data and states
//     setData({ name: '', description: '', is_active: 1 })
//     setIsEdit(false)
//     setOpen(false)
//   }

//   const handleChange = (field, value) => {
//     setData({ ...data, [field]: value })
//   }

//   const handleFileChange = (field, files) => {
//     const file = files?.[0] || null

//     console.log('Selected file:', file) // Should log File object
//     setData(prev => ({ ...prev, [field]: file }))
//   }

//   const handleSave = () => {
//   if (!data.name.trim()) {
//     alert('Name is required')
//     return
//   }

//   const formData = new FormData()
//   formData.append('name', data.name)
//   formData.append('description', data.description)
//   formData.append('is_active', data.is_active)

//   // Only append the image if it’s a File object
//   if (data.image instanceof File) {
//     formData.append('image', data.image)
//   }

//   // Send to backend
//   onSaveCategory(formData)
// }


//   return (
//     <Dialog
//       fullWidth
//       open={open}
//       onClose={handleClose}
//       maxWidth='md'
//       sx={{
//         '& .MuiDialog-container': { alignItems: 'flex-start' },
//         '& .MuiDialog-paper': {
//           overflow: 'visible',
//           width: 500,
//           maxWidth: '100%'
//         }
//       }}
//     >
//       <DialogCloseButton onClick={handleClose}>
//         <i className='tabler-x' />
//       </DialogCloseButton>

//       <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{isEdit ? 'Edit Vehicle Make' : 'Add Vehicle Make'}</DialogTitle>

//       <Divider sx={{ mx: -3, my: 2 }} />

//       <DialogContent sx={{ pt: 1 }}>
//         <Grid container spacing={5}>
//           {/* Name Field */}
//           <Grid size={{ xs: 12, sm: 12 }}>
//             <CustomTextField
//               label={<LabelWithStar>Name</LabelWithStar>}
//               fullWidth
//               value={data.name}
//               onChange={e => handleChange('name', e.target.value)}
//             />
//           </Grid>

//           {/* Image Upload */}
//           {/* <Grid size={{ xs: 12, sm: 12 }}>
//             <Typography
//               variant='caption'
//               component='label'
//               sx={{
//                 display: 'block',
//                 fontWeight: 400,
//                 color: 'text.primary'
//               }}
//             >
//               Image
//             </Typography>

//             <FileUploaderSingle onFileChange={files => handleFileChange('image', files)} />
//           </Grid> */}

//           <Grid size={{ xs: 12, sm: 12 }}>
//             <input
//               type='file'
//               onChange={e => {
//                 const file = e.target.files?.[0] || null

//                 setData(prev => ({ ...prev, image: file }))
//               }}
//             />
//           </Grid>

//           {/* Description */}
//           <Grid size={{ xs: 12, sm: 12 }}>
//             <CustomTextField
//               label='Description'
//               fullWidth
//               multiline
//               rows={2}
//               value={data.description}
//               onChange={e => handleChange('description', e.target.value)}
//             />
//           </Grid>

//           {/* Status dropdown — visible only when editing (isEdit is true) */}
//           {isEdit && (
//             <Grid size={{ xs: 12, sm: 12 }}>
//               <CustomTextField
//                 select
//                 label={<LabelWithStar>Status</LabelWithStar>}
//                 fullWidth
//                 value={data.is_active}
//                 onChange={e => handleChange('is_active', Number(e.target.value))}
//               >
//                 <MenuItem value={1}>Active</MenuItem>
//                 <MenuItem value={0}>Inactive</MenuItem>
//               </CustomTextField>
//             </Grid>
//           )}
//         </Grid>
//       </DialogContent>

//       <DialogActions sx={{ justifyContent: 'flex-end' }}>
//         {/* Close Button */}
//         <Button
//           onClick={handleClose}
//           variant='outlined'
//           sx={{
//             borderColor: theme.palette.text.primary,
//             color: theme.palette.text.primary,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: theme.palette.text.primary,
//               backgroundColor: theme.palette.mode === 'light' ? 'rgba(33, 44, 98, 0.08)' : 'rgba(255,255,255,0.08)'
//             }
//           }}
//         >
//           Close
//         </Button>

//         {/* Save / Add Button */}
//         <Button
//           onClick={handleSave}
//           type='submit'
//           variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
//           sx={{
//             textTransform: 'none',
//             backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
//             color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
//             borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
//             '&:hover': {
//               backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.08)',
//               borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
//             }
//           }}
//         >
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default AddModalWindow




// 'use client'

// import { useState, useEffect, useRef } from 'react'

// import Grid from '@mui/material/Grid2'
// import Dialog from '@mui/material/Dialog'
// import Button from '@mui/material/Button'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import DialogActions from '@mui/material/DialogActions'
// import Divider from '@mui/material/Divider'
// import { styled, useTheme } from '@mui/material/styles'
// import { MenuItem, Typography, Box } from '@mui/material'

// import DialogCloseButton from './closebtn'
// import CustomTextField from '@core/components/mui/TextField'

// // Label component with red star for required fields
// const LabelWithStar = styled('span')({
//   '&::before': {
//     content: '"*"',
//     color: 'red',
//     marginRight: 4
//   }
// })

// const AddModalWindow = ({ open, setOpen, onSaveCategory, editingRow }) => {
//   const theme = useTheme()
//   const fileInputRef = useRef(null) // ✅ Add this

//   // Default form state
//   const [data, setData] = useState({
//     name: '',
//     image: null,
//     description: '',
//     is_active: 1
//   })

//   const [isEdit, setIsEdit] = useState(false)

//   // Load data when editing
//   useEffect(() => {
//     if (editingRow) {
//       setData({
//         name: editingRow.name || '',
//         image: null, // always start as null for new upload
//         description: editingRow.description || '',
//         is_active: editingRow.is_active === 1 || editingRow.is_active === true ? 1 : 0
//       })
//       setIsEdit(true)
//     } else {
//       setData({ name: '', description: '', image: null, is_active: 1 })
//       setIsEdit(false)
//     }
//   }, [editingRow, open])

//   const handleClose = () => {
//     setData({ name: '', description: '', image: null, is_active: 1 })
//     setIsEdit(false)
//     setOpen(false)
//   }

//   const handleChange = (field, value) => {
//     setData(prev => ({ ...prev, [field]: value }))
//   }

//   const handleSave = () => {
//     if (!data.name.trim()) {
//       alert('Name is required')
//       return
//     }

//     const formData = new FormData()
//     formData.append('name', data.name)
//     formData.append('description', data.description)
//     formData.append('is_active', data.is_active)

//     if (data.image instanceof File) {
//       formData.append('image', data.image)
//     }

//     onSaveCategory(formData)
//   }

//   return (
//     <Dialog
//       fullWidth
//       open={open}
//       onClose={handleClose}
//       maxWidth='md'
//       sx={{
//         '& .MuiDialog-container': { alignItems: 'flex-start' },
//         '& .MuiDialog-paper': { overflow: 'visible', width: 500, maxWidth: '100%' }
//       }}
//     >
//       <DialogCloseButton onClick={handleClose}>
//         <i className='tabler-x' />
//       </DialogCloseButton>

//       <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
//         {isEdit ? 'Edit Vehicle Make' : 'Add Vehicle Make'}
//       </DialogTitle>

//       <Divider sx={{ mx: -3, my: 2 }} />

//       <DialogContent sx={{ pt: 1 }}>
//         <Grid container spacing={5}>
//           {/* Name Field */}
//           <Grid size={{ xs: 12, sm: 12 }}>
//             <CustomTextField
//               label={<LabelWithStar>Name</LabelWithStar>}
//               fullWidth
//               value={data.name}
//               onChange={e => handleChange('name', e.target.value)}
//             />
//           </Grid>

//           {/* Image Upload */}
//           {/* <Grid size={{ xs: 12, sm: 12 }}>
//             <Box sx={{ width: '100%' }}>
//               <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
//                 Image
//               </Typography>

//               <input
//                 type='file'
//                 style={{ display: 'none' }}
//                 ref={fileInputRef} // ✅ defined useRef
//                 onChange={e => {
//                   const file = e.target.files?.[0] || null
//                   setData(prev => ({ ...prev, image: file }))
//                 }}
//               />

//               <Button
//                 variant='outlined'
//                 fullWidth
//                 onClick={() => fileInputRef.current?.click()}
//                 sx={{
//                   justifyContent: 'center',
//                   borderStyle: 'solid',
//                   borderWidth: 1,
//                   padding: 1.5,
//                   textTransform: 'none'
//                 }}
//               >
//                 {data.image ? data.image.name : 'Click to Upload'}
//               </Button>
//             </Box>
//           </Grid> */}

//            <Grid size={{ xs: 12, sm: 4 }}>
//                           <Box sx={{ width: '100%' }}>
//                             <label
//                               htmlFor='logo-upload'
//                               style={{
//                                 display: 'block',
//                                 marginBottom: '1px',

//                                 fontWeight: 200,
//                                 fontSize: '0.8rem',
//                                 color: '#111'
//                               }}
//                             >
//                               Logo
//                             </label>

//                             <input
//                               type='file'
//                               accept='image/*'
//                               style={{ display: 'none' }}
//                               ref={logoInputRef}
//                               onChange={e => {
//                                 const file = e.target.files?.[0]

//                                 if (file) {
//                                   setData(prev => ({
//                                     ...prev,
//                                     logo: file,
//                                     logoPreview: URL.createObjectURL(file)
//                                   }))
//                                 }
//                               }}
//                             />

//                             <Button
//                               variant='outlined'
//                               fullWidth
//                               onClick={() => logoInputRef.current?.click()}
//                               sx={{
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 borderStyle: 'solid',
//                                 borderWidth: 1,
//                                 padding: 1.5,
//                                 height: 38,
//                                 textTransform: 'none',
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 overflow: 'hidden',
//                                 position: 'relative'
//                               }}
//                             >
//                               {data.logo ? (
//                                 <img
//                                   src={data.logo}
//                                   alt='Logo Preview'
//                                   style={{
//                                     width: '100%',
//                                     height: '100%',
//                                     objectFit: 'contain',
//                                     borderRadius: 6
//                                   }}
//                                 />
//                               ) : (
//                                 <Typography variant='body2' color='text.secondary'>
//                                   {getFileDisplay(data.logo)}
//                                 </Typography>
//                               )}
//                             </Button>
//                           </Box>
//                         </Grid>





//           {/* Description */}
//           <Grid size={{ xs: 12, sm: 12 }}>
//             <CustomTextField
//               label='Description'
//               fullWidth
//               multiline
//               rows={2}
//               value={data.description}
//               onChange={e => handleChange('description', e.target.value)}
//             />
//           </Grid>

//           {/* Status dropdown */}
//           {isEdit && (
//             <Grid size={{ xs: 12, sm: 12 }}>
//               <CustomTextField
//                 select
//                 label={<LabelWithStar>Status</LabelWithStar>}
//                 fullWidth
//                 value={data.is_active}
//                 onChange={e => handleChange('is_active', Number(e.target.value))}
//               >
//                 <MenuItem value={1}>Active</MenuItem>
//                 <MenuItem value={0}>Inactive</MenuItem>
//               </CustomTextField>
//             </Grid>
//           )}
//         </Grid>
//       </DialogContent>

//       <DialogActions sx={{ justifyContent: 'flex-end' }}>
//         <Button
//           onClick={handleClose}
//           variant='outlined'
//           sx={{
//             borderColor: theme.palette.text.primary,
//             color: theme.palette.text.primary,
//             textTransform: 'none',
//             '&:hover': {
//               borderColor: theme.palette.text.primary,
//               backgroundColor: theme.palette.mode === 'light' ? 'rgba(33, 44, 98, 0.08)' : 'rgba(255,255,255,0.08)'
//             }
//           }}
//         >
//           Close
//         </Button>

//         <Button
//           onClick={handleSave}
//           type='submit'
//           variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
//           sx={{
//             textTransform: 'none',
//             backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
//             color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
//             borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
//             '&:hover': {
//               backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.08)',
//               borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
//             }
//           }}
//         >
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default AddModalWindow









'use client'

import { useState, useEffect, useRef } from 'react'

import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'
import { MenuItem, Typography, Box } from '@mui/material'

import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'

// Label component with red star for required fields
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModelWindow = ({ open, setOpen, onSaveCategory, editingRow }) => {
  const theme = useTheme()
  const fileInputRef = useRef(null) // Unused, replaced by imageInputRef
  const imageInputRef = useRef(null)

  // Default form state
  const [data, setData] = useState({
    name: '',
    image: null,
    description: '',
    is_active: 1
  })

  const [isEdit, setIsEdit] = useState(false)

  // Load data when editing
  useEffect(() => {
    if (editingRow) {
      setData({
        name: editingRow.name || '',
        image: null, // always start as null for new upload
        description: editingRow.description || '',
        is_active: editingRow.is_active === 1 || editingRow.is_active === true ? 1 : 0
      })
      setIsEdit(true)
    } else {
      setData({ name: '', description: '', image: null, is_active: 1 })
      setIsEdit(false)
    }
  }, [editingRow, open])

  const handleClose = () => {
    setData({ name: '', description: '', image: null, is_active: 1 })
    setIsEdit(false)
    setOpen(false)
  }

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const getFileDisplay = fileValue => {
    if (fileValue instanceof File) {
      return fileValue.name // New file selected
    }

    if (fileValue && typeof fileValue === 'string') {
      // Show file name if URL contains it, or just "File Uploaded"
      const parts = fileValue.split('/')

      return parts.length > 1 ? parts.pop() : 'File Uploaded'
    }

    return 'Click to Upload' // No file
  }

  const handleSave = () => {
    if (!data.name.trim()) {
      alert('Name is required')

      return
    }

    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('is_active', data.is_active)

    if (data.image instanceof File) {
      formData.append('image', data.image)
    }

    // ✅ FIX applied here: Pass the formData AND the ID of the row being edited
    onSaveCategory(formData, editingRow ? editingRow.id : null)
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      sx={{
        '& .MuiDialog-container': { alignItems: 'flex-start' },
        '& .MuiDialog-paper': { overflow: 'visible', width: 500, maxWidth: '100%' }
      }}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{isEdit ? 'Edit Vehicle Make' : 'Add Vehicle Make'}</DialogTitle>

      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          {/* Name Field */}
          <Grid size={{ xs: 12, sm: 12 }}>
            <CustomTextField
              label={<LabelWithStar>Name</LabelWithStar>}
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          {/* Image Upload */}
          <Grid size={{ xs: 12, sm: 12 }}>
            <Box sx={{ width: '100%' }}>
              <label
                htmlFor='logo-upload'
                style={{
                  display: 'block',
                  marginBottom: '1px',

                  fontWeight: 200,
                  fontSize: '0.8rem',
                  color: '#111'
                }}
              >
                Image
              </label>

              <input
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                ref={imageInputRef}
                onChange={e => {
                  const file = e.target.files?.[0]

                  if (file) {
                    setData(prev => ({
                      ...prev,
                      image: file,
                      logoPreview: URL.createObjectURL(file)
                    }))
                  }
                }}
              />

              <Button
                variant='outlined'
                fullWidth
                onClick={() => imageInputRef.current?.click()}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  padding: 1.5,
                  height: 38,
                  textTransform: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {data.logo ? (
                  <img
                    src={data.image}
                    alt='Logo Preview'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: 6
                    }}
                  />
                ) : (
                  <Typography variant='body2' color='text.secondary'>
                    {getFileDisplay(data.image)}
                  </Typography>
                )}
              </Button>
            </Box>
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12, sm: 12 }}>
            <CustomTextField
              label='Description'
              fullWidth
              multiline
              rows={2}
              value={data.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </Grid>

          {/* Status dropdown */}
          {isEdit && (
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                select
                label={<LabelWithStar>Status</LabelWithStar>}
                fullWidth
                value={data.is_active}
                onChange={e => handleChange('is_active', Number(e.target.value))}
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          onClick={handleClose}
          variant='outlined'
          sx={{
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            textTransform: 'none',
            '&:hover': {
              borderColor: theme.palette.text.primary,
              backgroundColor: theme.palette.mode === 'light' ? 'rgba(33, 44, 98, 0.08)' : 'rgba(255,255,255,0.08)'
            }
          }}
        >
          Close
        </Button>

        <Button
          onClick={handleSave}
          type='submit'
          variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
          sx={{
            textTransform: 'none',
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
            color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
            borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.08)',
              borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
            }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddModelWindow
