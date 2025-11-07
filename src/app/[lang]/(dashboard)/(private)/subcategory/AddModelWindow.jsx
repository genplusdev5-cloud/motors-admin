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

// API Import
import { getCategories } from '@/services/subCategoryApi'

// Style for required field star
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModalWindow = ({ open, setOpen, initialData, onSave, editingRow }) => {
  const theme = useTheme()

  // Local state
  const [data, setData] = useState({
    id: '',
    name: '',
    description: '',
    category_id: '',
    is_active: '1' // Default to '1' (Active)
  })

  const [isEdit, setIsEdit] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // Handle editing row
  useEffect(() => {
    if (editingRow) {
      const initialIsActive = editingRow.is_active === 1 || editingRow.is_active === true ? '1' : '0'

      setData({
        name: editingRow.name || '',
        description: editingRow.description || '',
        category_id: editingRow.category_id || '',
        is_active: initialIsActive
      })
      setIsEdit(true)
    } else {
      setData({ name: '', description: '', category_id: '', is_active: '1' })
      setIsEdit(false)
    }
  }, [editingRow, open])

  // Fetch categories
  const fetchCategoryList = useCallback(async () => {
    setLoading(true)

    try {
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
  }, [])

  // Load categories when modal opens
  useEffect(() => {
    if (open) {
      fetchCategoryList()

      if (initialData) {
        setData({
          id: initialData.id || '',
          name: initialData.name || '',
          description: initialData.description || '',
          category_id: initialData.category_id || '',
          is_active: String(initialData.is_active ?? '1')
        })
      } else {
        // Set default state for ADD mode, ensuring is_active is '1' (Active)
        setData({
          id: '',
          name: '',
          description: '',
          category_id: '',
          is_active: '1' // Default to '1' (Active) when adding
        })
      }
    }
  }, [open, initialData, fetchCategoryList])

  // Handlers
  const handleClose = () => {
    setData({ category_id: '', name: '', description: '', is_active: '1' })
    setOpen(false)
  }

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!data.name.trim() || !data.category_id) {
      alert('Name and Category are required.')

      return
    }

    const formattedData = {
      name: data.name.trim(),
      description: data.description.trim(),
      category_id: data.category_id,

      // Send is_active only if in edit mode (using the dropdown value), otherwise assume active (1)
      is_active: isEdit ? Number(data.is_active) : 1
    }

    console.log('🛰 Sending Data:', formattedData)

    // Make sure ID is correct
    const id = isEdit && editingRow ? editingRow.id || editingRow.sub_category_id : null

    // Call the parent save function
    onSave(formattedData, id)

    handleClose()
  }

  const modalTitle = isEdit ? 'Edit SubCategory' : 'Add SubCategory'

  // ===============================
  // Render UI
  // ===============================
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

          {/* 🔸 Status Field (Only visible in EDIT mode) */}
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
