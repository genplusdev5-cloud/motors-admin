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
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'

import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderSingle from './FileUploaderSingle'

// Label with red star
const LabelWithStar = styled('span')({
  '&::before': { content: '"*"', color: 'red', marginRight: 4 }
})

const AddModalWindow = ({ open, setOpen, initialData, onSave }) => {
  const theme = useTheme()

  const [data, setData] = useState({
    id: '',
    name: '',
    description: '',
    width: '',
    height: '',
    logo: '',
    logoUrl: ''
  })

  const [imagePreview, setImagePreview] = useState(null)

  // Load data when editing or reset when adding
  useEffect(() => {
    if (open) {
      if (initialData) {
        setData({
          id: initialData.id,
          name: initialData.name || '',
          description: initialData.description || '',
          width: initialData.width || '',
          height: initialData.height || '',
          logo: '',

        })
        if (initialData.logoUrl) setImagePreview(initialData.logoUrl)
      } else {
        setData({ id: '', name: '', description: '', width: '', height: '', logo: '' })
        setImagePreview(null)
      }
    }
  }, [open, initialData])

  // Cleanup image preview to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const handleClose = () => setOpen(false)

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field, files) => {
    if (files && files[0]) {
      const file = files[0]
      const previewUrl = URL.createObjectURL(file)

      setData(prev => ({ ...prev, [field]: file, logoUrl: previewUrl }))
      setImagePreview(previewUrl)
    }
  }

  const handleSave = () => {
    if (!data.name.trim() || !data.description.trim()) {
      alert('Name and Description are required.')

      return
    }

    onSave(data)
  }

  const customThemeColor = '#212c62'
  const modalTitle = initialData ? 'Edit Banner Type' : 'Add Banner Type'
  const actionButtonText = initialData ? 'Save Update' : 'Add'

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      sx={{
        '& .MuiDialog-container': { alignItems: 'flex-start' },
        '& .MuiDialog-paper': { overflow: 'visible', width: 800, maxWidth: '100%' }
      }}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{modalTitle}</DialogTitle>
      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, sm: 12 }}>
            <CustomTextField
              label={<LabelWithStar>Name</LabelWithStar>}
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant='caption'
              component='label'
              sx={{ display: 'block', fontWeight: 400, color: 'text.primary' }}
            >
              <LabelWithStar /> Banner Image
            </Typography>

            <FileUploaderSingle onFileChange={files => handleFileChange('logo', files)} />

            {imagePreview && (
              <Box mt={1}>
                <img
                  src={imagePreview}
                  alt='Preview'
                  style={{
                    width: data.width ? `${data.width}px` : '100%',
                    height: data.height ? `${data.height}px` : 'auto',
                    objectFit: 'contain',
                    border: '1px solid #ccc',
                    borderRadius: 4
                  }}
                />
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <CustomTextField
              label={<LabelWithStar>Width</LabelWithStar>}
              fullWidth
              type='number'
              inputProps={{ min: 0, step: 1 }}
              value={data.width}
              onChange={e => handleChange('width', e.target.value)}
              InputProps={{ endAdornment: <InputAdornment position='end'>px</InputAdornment> }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <CustomTextField
              label={<LabelWithStar>Height</LabelWithStar>}
              fullWidth
              type='number'
              inputProps={{ min: 0, step: 1 }}
              value={data.height}
              onChange={e => handleChange('height', e.target.value)}
              InputProps={{ endAdornment: <InputAdornment position='end'>px</InputAdornment> }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            <CustomTextField
              label={<LabelWithStar>Description</LabelWithStar>}
              fullWidth
              multiline
              rows={2}
              type='textarea'
              value={data.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </Grid>
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
              {actionButtonText}
            </Button>
          </DialogActions>



    </Dialog>
  )
}

export default AddModalWindow
