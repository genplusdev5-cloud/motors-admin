'use client'

import { useState, useEffect } from 'react'

import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography' // ✅ FIXED HERE
import { MenuItem } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'

import DialogCloseButton from './closebtn'

// import CustomTextField from '@core/components/mui/TextField' // CustomTextField might not support type='color' well, but we'll try to adapt.

// Styled component for the required label star
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

// Styled component for the Color Picker input wrapper
// Standard HTML input type="color" is used for the color selection
const StyledColorInput = styled('input')({
  // Hide the default color input border/style
  appearance: 'none',
  border: 'none',
  width: '100%',
  height: '40px', // Adjust height as needed
  backgroundColor: 'transparent',
  cursor: 'pointer',
  '&::-webkit-color-swatch-wrapper': {
    padding: 0
  },
  '&::-webkit-color-swatch': {
    border: 'none',
    borderRadius: '4px' // Match MUI borderRadius
  }
})

const AddModelWindow = ({ open, setOpen, onSaveCategory, editingRow }) => {
  const theme = useTheme()

  // Default 'name' to a default hex color for a better user experience
  const [data, setData] = useState({ name: '', description: '', is_active: '1' })
  const [isEdit, setIsEdit] = useState(false)

  // ✅ Populate fields when editing
  useEffect(() => {
    if (editingRow) {
      // Check if name is a valid hex code (or default to white if not for color input)
      const initialName =
        editingRow.name && /^#([0-9A-F]{3}){1,2}$/i.test(editingRow.name.trim()) ? editingRow.name.trim() : ''

      const initialIsActive = editingRow.is_active === 1 || editingRow.is_active === true ? '1' : '0'

      setData({
        name: initialName, // Use validated or default hex code
        description: editingRow.description || '',
        is_active: initialIsActive
      })
      setIsEdit(true)
    } else {
      // Reset to default hex color and default active status ('1') for new category
      setData({ name: '', description: '', is_active: '1' })
      setIsEdit(false)
    }
  }, [editingRow, open])

  const handleClose = () => {
    // Reset state and close
    setData({ name: '', description: '', is_active: '1' })
    setIsEdit(false)
    setOpen(false)
  }

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // ✅ When user clicks Add / Update
  const handleSave = () => {
    // The color input type="color" should always provide a value, but we can check if it's a valid hex.
    if (!data.name.trim() || !/^#([0-9A-F]{3}){1,2}$/i.test(data.name.trim())) {
       toast('⚠️ color is required.')


      return
    }

    const formattedData = {
      name: data.name.trim(), // Assuming 'name' stores the hex code
      description: data.description.trim(),
      is_active: Number(data.is_active)
    }

    const id = isEdit && editingRow ? editingRow.id : null

    // Pass formattedData and ID to the save function in the parent component
    onSaveCategory(formattedData, id)
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='xs'
      sx={{
        '& .MuiDialog-container': { alignItems: 'flex-start' },

        '& .MuiDialog-paper': { overflow: 'visible', width: 400, maxWidth: '100%' }
      }}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{isEdit ? 'Edit Color' : 'Add Color'}</DialogTitle>

      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label='name'
              fullWidth
              rows={2}
              type='color'
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label='Description'
              fullWidth
              multiline
              rows={2}
              type='textarea'
              value={data.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </Grid>

          {/* ✅ Show Status dropdown only when editing */}
          {isEdit && (
            <Grid size={{ xs: 12 }}>
              {/* NOTE: Changed onChange to pass string value to avoid conflicting with the Number() cast inside the component */}
              <CustomTextField
                select
                label={<LabelWithStar>Status</LabelWithStar>}
                fullWidth
                value={data.is_active}
                onChange={e => handleChange('is_active', e.target.value)}
              >
                <MenuItem value={'1'}>Active</MenuItem>
                <MenuItem value={'0'}>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant='outlined'
          onClick={handleClose}
          sx={{
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            textTransform: 'none',
            '&:hover': { borderColor: theme.palette.text.primary, backgroundColor: 'rgba(33, 44, 98, 0.08)' }
          }}
        >
          Close
        </Button>

        <Button
          type='submit'
          onClick={handleSave}
          variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
          sx={{
            textTransform: 'none',
            backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
            color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
            borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(33, 44, 98, 0.08)',
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

export default AddModelWindow
