'use client'

import { useState, useEffect, useCallback } from 'react'

import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'
import { MenuItem } from '@mui/material'

import { toast } from 'react-toastify'

import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'
import { getCategories } from '@/services/subCategoryApi'

// 🔸 Label with red asterisk for required fields
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModalWindow = ({ open, setOpen, initialData, onSave }) => {
  const theme = useTheme()

  // 🔹 Form state
  const [data, setData] = useState({
    id: '',
    name: '',
    description: '',
    category_id: '',
    is_active: '1'
  })

  const [categories, setCategories] = useState([])
  const [isEdit, setIsEdit] = useState(false)

  // 🔹 Set form data depending on whether we're editing or adding
  useEffect(() => {
    if (initialData) {
      setIsEdit(true)
      setData({
        id: initialData.id || '',
        name: initialData.name || '',
        description: initialData.description || '',
        category_id: initialData.category_id || '',
        is_active: initialData.is_active !== undefined ? String(initialData.is_active) : '1'
      })
    } else {
      setIsEdit(false)
      setData({
        id: '',
        name: '',
        description: '',
        category_id: '',
        is_active: '1'
      })
    }
  }, [initialData, open])

  // 🔹 Fetch category list
  const fetchCategoryList = useCallback(async () => {
    try {
      const result = await getCategories()

      if (Array.isArray(result)) setCategories(result)
      else setCategories([])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }, [])

  useEffect(() => {
    if (open) fetchCategoryList()
  }, [open, fetchCategoryList])

  // 🔹 Handle field change
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // 🔹 Handle Save (validation + call onSave)
  const handleSave = () => {
    if (!data.name.trim() || !data.category_id) {
     toast('⚠️ Name and Category are required.')


      return
    }

    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || '',
      category_id: data.category_id,
      is_active: Number(data.is_active)
    }

    const id = isEdit ? data.id : null

    onSave(payload, id)
  }

  // 🔹 Close modal
  const handleClose = () => setOpen(false)

  // 🔹 Modal Title
  const modalTitle = isEdit ? 'Edit SubCategory' : 'Add SubCategory'

  // 🔹 Render
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      sx={{
        '& .MuiDialog-container': { alignItems: 'flex-start' },
        '& .MuiDialog-paper': {
          overflow: 'visible',
          width: 500,
          maxWidth: '100%'
        }
      }}
    >
      {/* 🔸 Close Button */}
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      {/* 🔸 Header */}
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{modalTitle}</DialogTitle>
      <Divider sx={{ mx: -3, my: 2 }} />

      {/* 🔸 Form Fields */}
      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          {/* Category Dropdown */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Category</LabelWithStar>}
              fullWidth
              value={data.category_id}
              onChange={e => handleChange('category_id', e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value=''>Select Category</MenuItem>
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          {/* Name Field */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label={<LabelWithStar>Name</LabelWithStar>}
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          {/* Description Field */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label='Description'
              fullWidth
              multiline
              rows={2}
              value={data.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </Grid>

          {/* Status (Only visible in Edit mode) */}
          {isEdit && (
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                select
                label={<LabelWithStar>Status</LabelWithStar>}
                fullWidth
                value={data.is_active}
                onChange={e => handleChange('is_active', e.target.value)}
              >
                <MenuItem value='1'>Active</MenuItem>
                <MenuItem value='0'>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      {/* 🔹 Action Buttons */}
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
          {isEdit ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddModalWindow





// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import Grid from '@mui/material/Grid2'
// import Dialog from '@mui/material/Dialog'
// import Button from '@mui/material/Button'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import DialogActions from '@mui/material/DialogActions'
// import Divider from '@mui/material/Divider'
// import { styled, useTheme } from '@mui/material/styles'
// import { MenuItem } from '@mui/material'
// import DialogCloseButton from './closebtn'
// import CustomTextField from '@core/components/mui/TextField'
// import { getCategories } from '@/services/subCategoryApi'

// const LabelWithStar = styled('span')({
//   '&::before': {
//     content: '"*"',
//     color: 'red',
//     marginRight: 4
//   }
// })

// const AddModalWindow = ({ open, setOpen, initialData, onSave }) => {
//   const theme = useTheme()

//   const [data, setData] = useState({
//     id: '',
//     name: '',
//     description: '',
//     category_id: '',
//     is_active: '1'
//   })
//   const [categories, setCategories] = useState([])
//   const [isEdit, setIsEdit] = useState(false)

//   useEffect(() => {
//     if (initialData) {
//       setIsEdit(true)
//       setData({
//         id: initialData.id || '',
//         name: initialData.name || '',
//         description: initialData.description || '',
//         category_id: initialData.category_id || '',
//         is_active: initialData.is_active?.toString() || '1'
//       })
//     } else {
//       setIsEdit(false)
//       setData({
//         id: '',
//         name: '',
//         description: '',
//         category_id: '',
//         is_active: '1'
//       })
//     }
//   }, [initialData, open])

//   const fetchCategoryList = useCallback(async () => {
//     try {
//       const result = await getCategories()
//       setCategories(Array.isArray(result) ? result : [])
//     } catch (error) {
//       console.error('Error fetching categories:', error)
//       setCategories([])
//     }
//   }, [])

//   useEffect(() => {
//     if (open) fetchCategoryList()
//   }, [open, fetchCategoryList])

//   const handleChange = (field, value) => {
//     setData(prev => ({ ...prev, [field]: value }))
//   }

//   const handleSave = () => {
//     if (!data.name.trim() || !data.category_id) {
//       alert('Name and Category are required.')
//       return
//     }
//     const payload = {
//       name: data.name.trim(),
//       description: data.description.trim(),
//       category_id: data.category_id,
//       is_active: Number(data.is_active)
//     }
//     const id = isEdit ? data.id : null
//     onSave(payload, id)
//   }

//   const handleClose = () => setOpen(false)

//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
//       <DialogCloseButton onClick={handleClose}>
//         <i className='tabler-x' />
//       </DialogCloseButton>
//       <DialogTitle>{isEdit ? 'Edit SubCategory' : 'Add SubCategory'}</DialogTitle>
//       <Divider />

//       <DialogContent>
//         <Grid container spacing={5}>
//           <Grid size={{ xs: 12 }}>
//             <CustomTextField
//               select
//               label={<LabelWithStar>Category</LabelWithStar>}
//               fullWidth
//               value={data.category_id}
//               onChange={e => handleChange('category_id', e.target.value)}
//             >
//               <MenuItem value=''><em>Select Category</em></MenuItem>
//               {categories.map(cat => (
//                 <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
//               ))}
//             </CustomTextField>
//           </Grid>

//           <Grid size={{ xs: 12 }}>
//             <CustomTextField
//               label={<LabelWithStar>Name</LabelWithStar>}
//               fullWidth
//               value={data.name}
//               onChange={e => handleChange('name', e.target.value)}
//             />
//           </Grid>

//           <Grid size={{ xs: 12 }}>
//             <CustomTextField
//               label='Description'
//               fullWidth
//               multiline
//               rows={2}
//               value={data.description}
//               onChange={e => handleChange('description', e.target.value)}
//             />
//           </Grid>

//           {isEdit && (
//             <Grid size={{ xs: 12 }}>
//               <CustomTextField
//                 select
//                 label={<LabelWithStar>Status</LabelWithStar>}
//                 fullWidth
//                 value={data.is_active}
//                 onChange={e => handleChange('is_active', e.target.value)}
//               >
//                 <MenuItem value='1'>Active</MenuItem>
//                 <MenuItem value='0'>Inactive</MenuItem>
//               </CustomTextField>
//             </Grid>
//           )}
//         </Grid>
//       </DialogContent>

//       <DialogActions sx={{ justifyContent: 'flex-end' }}>
//         <Button variant='outlined' onClick={handleClose}>Close</Button>
//         <Button variant='contained' onClick={handleSave}>
//           {isEdit ? 'Update' : 'Add'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default AddModalWindow
