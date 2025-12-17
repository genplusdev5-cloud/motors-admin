'use client'

import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import GlobalButton from '@/components/common/GlobalButton'

const GlobalDialog = ({
  open,
  title,
  children,
  onClose,
  onSave,
  maxWidth = 'sm',
  fullWidth = true,
  saveText = 'Save',
  cancelText = 'Close',
  deleteMode = false,
  loading = false,
  hideActions = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          mt: 10,
          p: 0,
          overflow: 'hidden',
          textAlign: deleteMode ? 'center' : 'start'
        }
      }}
    >
      {/* TITLE */}
      <DialogTitle
        sx={{
          fontSize: 20,
          fontWeight: 700,
          position: 'relative',
          pb: deleteMode ? 1 : 0,
          pt: deleteMode ? 3 : 3,
          px: 3,
          display: deleteMode ? 'flex' : 'block',
          alignItems: deleteMode ? 'center' : 'start',
          justifyContent: deleteMode ? 'center' : 'start',
          gap: deleteMode ? 1 : 0,
          color: deleteMode ? 'error.main' : 'text.primary'
        }}
      >
        {deleteMode && (
          <WarningAmberIcon color='error' sx={{ fontSize: 26 }} />
        )}
        {title}

        {/* CLOSE BUTTON */}
        <IconButton
          onClick={onClose}
          size='small'
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            '&:hover': {
              bgcolor: 'action.selected'
            }
          }}
        >
          <i className='tabler-x' style={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent
        dividers
        sx={{
          px: deleteMode ? 5 : 3,
          pt: deleteMode ? 2 : 3,
          pb: deleteMode ? 3 : 3
        }}
      >
        {children}
      </DialogContent>

      {/* ACTION BUTTONS */}
      {!hideActions && (
        <DialogActions
          sx={{
            justifyContent: deleteMode ? 'center' : 'flex-end',
            px: 3,
            py: 3,
            gap: 2
          }}
        >
          <GlobalButton variant='outlined' color='secondary' onClick={onClose}>
            {cancelText}
          </GlobalButton>

          <GlobalButton
            variant='contained'
            color={deleteMode ? 'error' : 'primary'}
            onClick={onSave}
            disabled={loading}
          >
            {loading ? (deleteMode ? 'Deleting…' : 'Saving…') : saveText}
          </GlobalButton>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default GlobalDialog
