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
import { MenuItem, Typography } from '@mui/material'

import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderSingle from './FileUploaderSingle' // Assuming this path is correct

// Label component with red star for required fields
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModalWindow = ({ open, setOpen, onSaveCategory, editingRow }) => {
  const theme = useTheme()

  // Default form state
  const [data, setData] = useState({
    name: '',
    image: '',
    description: '',
    is_active: 1
  })

  const [isEdit, setIsEdit] = useState(false)

  // const [touched, setTouched] = useState({}) // Not used in the provided code

  // Load data when editing
  useEffect(() => {
    if (editingRow) {
      setData({
        name: editingRow.name || '',
        image: editingRow.image || '',
        description: editingRow.description || '',

        // Map any truthy/falsy value to 1 or 0 for the dropdown
        is_active: editingRow.is_active === 1 || editingRow.is_active === true ? 1 : 0
      })
      setIsEdit(true)
    } else {
      // Reset for Add mode
      setData({ name: '', description: '', is_active: 1 })
      setIsEdit(false)
    }
  }, [editingRow, open])

  const handleClose = () => {
    // Reset data and states
    setData({ name: '', description: '', is_active: 1 })
    setIsEdit(false)
    setOpen(false)
  }

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value })
  }

  const handleFileChange = (field, files) => {
    const file = Array.isArray(files) ? files[0] : files

    setData(prev => ({ ...prev, [field]: file }))
  }

  const handleSave = () => {
    if (!data.name.trim()) {
      alert('Brand Name is required.')

      return
    }

    // Pass id (if edit) to parent so it can call PUT endpoint; null => create
    const id = isEdit && editingRow ? editingRow.id : null

    // Pass the payload to the parent component's save handler
    onSaveCategory(data, id)
  }

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

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{isEdit ? 'Edit Brand' : 'Add Brand'}</DialogTitle>

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
            <Typography
              variant='caption'
              component='label'
              sx={{
                display: 'block',
                fontWeight: 400,
                color: 'text.primary'
              }}
            >
              Image
            </Typography>
            {/* NOTE: You need to handle existing image display if editing */}
            <FileUploaderSingle onFileChange={files => handleFileChange('image', files)} />
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

          {/* Status dropdown — visible only when editing (isEdit is true) */}
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
        {/* Close Button */}
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

        {/* Save / Add Button */}
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

export default AddModalWindow
