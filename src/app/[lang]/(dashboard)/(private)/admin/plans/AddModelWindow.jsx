// AddModalWindow.jsx (or AddModalWindow.js)

'use client'

import { useState, useEffect } from 'react' // 💡 Import useEffect

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

// 💡 Update component props to include initialData and onSave
const AddModalWindow = ({ open, setOpen, initialData, onSave }) => {
  const theme = useTheme()

  // 💡 Use an object with all fields, matching the Brand component's mock data structure
  const [brandData, setBrandData] = useState({
    id: null,
    name: '',
    description: ''
  })

  // 💡 Use useEffect to update form fields when the modal opens for editing
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit Mode: Set data from initialData
        setBrandData({
          id: initialData.id,
          name: initialData.name,
          description: initialData.description,

          // You might need to carry over other fields like status if they are editable
          status: initialData.status,
          acc: initialData.acc
        })
      } else {
        // Add Mode: Reset to initial empty state
        setBrandData({ id: null, name: '', description: '' })
      }
    }
  }, [open, initialData]) // Dependency array: run when 'open' or 'initialData' changes

  const handleClose = () => setOpen(false)

  const handleChange = (field, value) => {
    setBrandData({ ...brandData, [field]: value })
  }

  const handleSave = () => {
    // Basic validation
    if (!brandData.name.trim() || !brandData.description.trim()) {
      alert('Please fill in both Name and Description.')

      return
    }

    // 💡 Call the onSave function passed from the parent with the form data
    onSave(brandData)

    // The onSave function in the parent will handle closing the modal
  }

  const customThemeColor = '#212c62'

  // Determine title based on presence of initialData/ID
  const modalTitle = initialData ? 'Edit Plans' : 'Add Plans'
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

      {/* 💡 Dynamic Title */}
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{modalTitle}</DialogTitle>

      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, sm: 12 }}>
            {/* Field for the Brand Name */}
            <CustomTextField
              label={<LabelWithStar> Name</LabelWithStar>}
              fullWidth
              sx={{ mt: 3 }}
              value={brandData.name} // 💡 Use brandData.name
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            {/* Field for the Brand Description */}
            <CustomTextField
              label={<LabelWithStar>Description</LabelWithStar>}
              fullWidth
              multiline
              rows={2}
              value={brandData.description} // 💡 Use brandData.description
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
