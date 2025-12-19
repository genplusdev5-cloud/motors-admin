'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box
} from '@mui/material'

import WarningAmberIcon from '@mui/icons-material/WarningAmber'

import GlobalButton from '@/components/common/GlobalButton'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

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
      closeAfterTransition={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'visible' // 🔥 IMPORTANT for floating close button
        }
      }}
    >
      {/* ===== TITLE ===== */}
      <DialogTitle sx={{ position: 'relative', pr: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {deleteMode && <WarningAmberIcon color='error' sx={{ fontSize: 24 }} />}

          <Typography
            variant='h5'
            component='span'
            color={deleteMode ? 'error.main' : 'text.primary'}
          >
            {title}
          </Typography>
        </Box>

        {/* ===== SAME CLOSE BUTTON AS DialogsCustomized ===== */}
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      {/* ===== CONTENT ===== */}
      <DialogContent sx={{ px: deleteMode ? 5 : 3, py: 3 }}>
        {children}
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      {!hideActions && (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            justifyContent: deleteMode ? 'center' : 'flex-end',
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
