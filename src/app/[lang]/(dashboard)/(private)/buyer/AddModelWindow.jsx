// AddModalWindow.jsx (Modal Component)

'use client'

import { useState, useEffect } from 'react' // Import useEffect

import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'

// Assuming DialogCloseButton is in the same directory or correctly imported
import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'

// Styles for required star (unchanged)
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

// Update component props: accept initialData and onSave
const AddModalWindow = ({ open, setOpen, initialData, onSave }) => {
  const theme = useTheme()

  // State to manage form fields: name, description, and the id (for editing)
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: ''
  })

  // 💡 EFFECT: Populate form fields when the modal opens in EDIT mode
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit Mode: Load data from the initialData object (the row being edited)
        setFormData({
          id: initialData.id,
          name: initialData.name,
          description: initialData.description
        })
      } else {
        // Add Mode: Reset to empty state
        setFormData({ id: null, name: '', description: '' })
      }
    }
  }, [open, initialData])

  const handleClose = () => setOpen(false)

  const handleChange = (field, value) => {
    // Update the correct field in the formData state
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Basic validation
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Name and Description are required.')

      return
    }

    // Call the parent component's save function (handleSaveData)
    onSave(formData)

    // The parent component will close the modal upon successful save/add
  }

  const customThemeColor = '#212c62'

  // Determine text based on whether we are adding or editing
  const modalTitle = initialData ? 'Edit Buyer' : 'Add Buyer'
  const actionButtonText = initialData ? 'Save Changes' : 'Add'

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start'
        },
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
          <Grid size={{ xs: 12, sm: 12 }}>
            {/* Field for Name */}
            <CustomTextField
              label={<LabelWithStar>Name</LabelWithStar>}
              fullWidth
              type='text'
              value={formData.name} // Bind to formData.name
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            {/* Field for Description */}
            <CustomTextField
              label={<LabelWithStar>Description</LabelWithStar>}
              fullWidth
              multiline
              type='textarea'
              rows={2}
              value={formData.description} // Bind to formData.description
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
