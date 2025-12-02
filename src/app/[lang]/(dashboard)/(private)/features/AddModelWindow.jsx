'use client'

import { useState, useEffect, useCallback } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'
import { MenuItem } from '@mui/material'

// Component Imports
import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'



// Style for required field star
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModalWindow = ({ open, setOpen, initialData, onSave }) => {
  const theme = useTheme() // 🔹 Local state for form data

  const [data, setData] = useState({
    id: '',
    name: '',
    description: '',
    category_id: '',
    is_active: '1'
  }) // 🔹 Local state for dropdown options

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false) // 🔹 Fetch categories from API

  const fetchCategoryList = useCallback(async () => {
    setLoading(true)

    try {
      // ✅ Calling the correctly imported function
      const result = await getCategories()

      if (Array.isArray(result)) {
        setCategories(result)
      } else {
        console.error('Unexpected category response:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, []) // 🔹 Load categories + initialize form data

  useEffect(() => {
    if (open) {
      fetchCategoryList()

      if (initialData) {
        // Edit mode
        setData({
          id: initialData.id || '',
          name: initialData.name || '',
          description: initialData.description || '',
          category_id: initialData.category_id || '',
          is_active: String(initialData.is_active ?? '1')
        })
      } else {
        // Add mode
        setData({ id: '', name: '', description: '', category_id: '', is_active: '1' })
      }
    }
  }, [open, initialData, fetchCategoryList]) // 🔹 Helpers

  const handleClose = () => {
    setData({ category_id: '', name: '', description: '', is_active: '1' })
    setOpen(false)
  }

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Client-side validation
    if (!data.name.trim() || !data.category_id) {
      alert('Name and Category are required.')

      return
    }

    const formattedData = {
      name: data.name.trim(),
      description: data.description.trim(),
      category_id: data.category_id,
      is_active: Number(data.is_active)
    }

    onSave(formattedData, data.id)
  } // 🔹 UI labels

  const isEdit = !!initialData
  const modalTitle = isEdit ? 'Edit Features' : 'Add Features'

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

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{modalTitle}</DialogTitle>
      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          {/* 🔸 Category Dropdown */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Category</LabelWithStar>}
              fullWidth
              value={data.category_id}
              onChange={e => handleChange('category_id', Number(e.target.value))}
            >
              <MenuItem value=''>
                <em>{loading ? 'Loading...' : 'Select Category'}</em>
              </MenuItem>

              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          {/* 🔸 Name Field */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label={<LabelWithStar>Name</LabelWithStar>}
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          {/* 🔸 Description Field */}
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

          {/* 🔸 Status Field (Edit mode only) */}
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
