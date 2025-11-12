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

import { MenuItem } from '@mui/material'

import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'

const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModelWindow = ({ open, setOpen, onSaveCategory, editingRow }) => {
  const theme = useTheme()

  // 💡 State now correctly tracks 'is_active'. Default to '1' (Active) for new items.
  const [data, setData] = useState({ name: '', description: '', is_active: '1' })
  const [isEdit, setIsEdit] = useState(false)

  // ✅ Populate fields when editing
  useEffect(() => {
    if (editingRow) {
      // 💡 Convert the incoming is_active (which might be 1 or true) to the string '1' or '0'
      // to match the <option> values in the Select input.
      const initialIsActive = editingRow.is_active === 1 || editingRow.is_active === true ? '1' : '0'

      setData({
        name: editingRow.name || '',
        description: editingRow.description || '',
        is_active: initialIsActive // Set the string value
      })
      setIsEdit(true)
    } else {
      // Reset to empty and default active status ('1') for new category
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
    if (!data.name.trim()) {
      toast('⚠️ Name is required.')

      return
    }

    const formattedData = {
      name: data.name.trim(),
      description: data.description.trim(),

      // 💡 CRITICAL FIX: Convert the string value ('1' or '0') from the dropdown back to a number
      is_active: Number(data.is_active) // ✅ Backend expects numeric
    }

    const id = isEdit && editingRow ? editingRow.id : null

    onSaveCategory(formattedData, id)
    handleClose() // Close on save (assuming onSaveCategory handles errors internally)
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

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{isEdit ? 'Edit Engine Type ' : 'Add Engine type'}</DialogTitle>

      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, sm: 12 }}>
            <CustomTextField
              label={<LabelWithStar>Name</LabelWithStar>}
              fullWidth
              type='text'
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
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
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                select
                label={<LabelWithStar>Status</LabelWithStar>}
                fullWidth
                value={data.is_active}
                onChange={e => handleChange('is_active', Number(e.target.value))} // ensure numeric
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
