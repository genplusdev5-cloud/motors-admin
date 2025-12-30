'use client'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

const GlobalButton = ({
  children,
  color = 'primary',
  variant = 'contained',
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  href,
  onClick,
  className = '',
  loading = false,        // ✅ EXPLICITLY TAKE loading
  ...props                // ❌ loading removed from here
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled || loading}   // ✅ auto-disable on loading
      startIcon={
        loading ? (
          <CircularProgress size={16} color='inherit' />
        ) : (
          startIcon
        )
      }
      endIcon={endIcon}
      href={href}
      onClick={onClick}
      className={className}
      sx={{
        textTransform: 'none',
        fontWeight: 500,
        px: 2.5,
        height: 36
      }}
      {...props}           // ✅ safe now
    >
      {children}
    </Button>
  )
}

export default GlobalButton
