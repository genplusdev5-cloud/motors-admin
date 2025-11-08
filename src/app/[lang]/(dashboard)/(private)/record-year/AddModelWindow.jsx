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
  const [data, setData] = useState({ name: '', description: '', is_active: '1' })
  const [isEdit, setIsEdit] = useState(false)

  // ✅ Populate fields when editing
  useEffect(() => {
    if (editingRow) {
      const initialIsActive = editingRow.is_active === 1 || editingRow.is_active === true ? '1' : '0'

      setData({
        name: editingRow.name || '',
        description: editingRow.description || '',
        is_active: initialIsActive
      })
      setIsEdit(true)
    } else {
      setData({ name: '', description: '', is_active: '1' })
      setIsEdit(false)
    }
  }, [editingRow, open])

  const handleClose = () => {
    setData({ name: '', description: '', is_active: '1' })
    setIsEdit(false)
    setOpen(false)
  }

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // ✅ Numeric validation for 4-digit limit
  const handleYearChange = e => {
    const val = e.target.value

    // Allow only digits
    if (/^\d*$/.test(val)) {
      // Limit to 4 digits
      if (val.length <= 4) {
        setData(prev => ({ ...prev, name: val }))
      }
    }
  }

  const handleSave = () => {
    if (!data.name.trim()) {
      alert('Year is required!')

      return
    }

    if (!/^\d{4}$/.test(data.name.trim())) {
      alert('Year must be a 4-digit number!')

      return
    }

    const formattedData = {
      name: data.name.trim(),
      description: data.description.trim(),
      is_active: Number(data.is_active)
    }

    const id = isEdit && editingRow ? editingRow.id : null

    onSaveCategory(formattedData, id)
    handleClose()
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

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{isEdit ? 'Edit Record Year' : 'Add Record Year'}</DialogTitle>

      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
          {/* ✅ Only integer input (4 digits) */}
          <Grid size={{ xs: 12, sm: 12 }}>
            <CustomTextField
              label={<LabelWithStar>Year</LabelWithStar>}
              fullWidth
              type='text'
              value={data.name}
              onChange={handleYearChange}
              inputProps={{
                maxLength: 4,
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
            />
          </Grid>

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

          {isEdit && (
            <Grid size={{ xs: 12, sm: 12 }}>
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

      <DialogActions sx={{ justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant='outlined'
          onClick={handleClose}
          sx={{
            borderColor: '#212c62',
            color: '#212c62',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#212c62',
              backgroundColor: 'rgba(33, 44, 98, 0.08)'
            }
          }}
        >
          Close
        </Button>

        <Button
          type='submit'
          onClick={handleSave}
          variant='contained'
          sx={{
            textTransform: 'none',
            backgroundColor: '#212c62',
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: '#1a2552'
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
