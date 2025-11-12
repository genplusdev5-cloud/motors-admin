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
import InputAdornment from '@mui/material/InputAdornment'

import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'

// Red star for required fields
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModalWindow = ({ open, setOpen, onSaveCategory, editingRow }) => {
  const theme = useTheme()
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const [data, setData] = useState({
    name: '',
    image: null,
    description: '',
    width: '',
    height: '',
    is_active: 1
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [isEdit, setIsEdit] = useState(false) // Load data when editing

  useEffect(() => {
    if (editingRow) {
      setData({
        name: editingRow.name || '',
        image: null,
        description: editingRow.description || '',
        width: editingRow.width || '',
        height: editingRow.height || '',
        is_active: editingRow.is_active === 1 || editingRow.is_active === true ? 1 : 0
      })
      setImagePreview(editingRow.image || null)
      setIsEdit(true)
    } else {
      setData({ name: '', description: '', width: '', height: '', image: null, is_active: 1 })
      setImagePreview(null)
      setIsEdit(false)
    }
  }, [editingRow, open])

  const handleClose = () => {
    setData({ name: '', description: '', width: '', height: '', image: null, is_active: 1 })
    setImagePreview(null)
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

  const handleFileChange = e => {
    const file = e.target.files?.[0] || null

    setData(prev => ({ ...prev, image: file }))

    if (file) {
      const reader = new FileReader()

      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      // If file is cleared
      setImagePreview(null)
    }
  }

  // New handler to clear the image
  const handleClearImage = () => {
    setData(prev => ({ ...prev, image: null }))
    setImagePreview(null)
    if (imageInputRef.current) imageInputRef.current.value = null // Reset file input
  }

  const handleSave = () => {
    if (!data.name.trim()) {
    toast('⚠️ Name is required.')

      return
    }

    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('width', data.width)
    formData.append('height', data.height)
    formData.append('is_active', data.is_active)
    if (data.image instanceof File) formData.append('image', data.image) // Pass the form data and row id if editing

    onSaveCategory(formData, isEdit ? editingRow.id : null)
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

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{isEdit ? 'Edit Banner Type' : 'Add Banner Type '}</DialogTitle>

      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          {/* Name */}
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

          {/* Width */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label={<LabelWithStar>Width</LabelWithStar>}
              fullWidth
              type='number'
              value={data.width}
              onChange={e => handleChange('width', e.target.value)}
              InputProps={{ endAdornment: <InputAdornment position='end'>px</InputAdornment> }}
            />
          </Grid>

          {/* Height */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label={<LabelWithStar>Height</LabelWithStar>}
              fullWidth
              type='number'
              value={data.height}
              onChange={e => handleChange('height', e.target.value)}
              InputProps={{ endAdornment: <InputAdornment position='end'>px</InputAdornment> }}
            />
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

          {/* Status */}
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
        <Button onClick={handleClose} variant='outlined' sx={{ textTransform: 'none' }}>
          Close
        </Button>
        <Button onClick={handleSave} variant='contained' sx={{ textTransform: 'none' }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddModalWindow
