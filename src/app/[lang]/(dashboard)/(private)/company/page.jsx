'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography } from '@mui/material'

import { useRouter } from 'next/navigation'

import { openDB } from 'idb'
import { showToast } from '@/components/common/Toasts'

// MUI imports
import { styled, useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import GlobalButton from '@/components/common/GlobalButton'
import GlobalDialog from '@/components/common/GlobalDialog'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

// Assuming this path to your services file

import Link from '@/components/Link'
import CustomTextField from '@core/components/mui/TextField'

import { getCompanyData, updateCompanyData } from '@/api/company'

// --- Label styling (unchanged)
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

// --- IndexedDB setup (unchanged)
const getCompanyDB = async () => {
  return openDB('companyDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('companies')) {
        db.createObjectStore('companies', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

const Company = () => {
  const theme = useTheme()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editCompanyId, setEditCompanyId] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const MAX_FILE_SIZE = 1048576 // 1MB in bytes

  /**
   * Formats a raw 10-digit number into the specified display format.
   * @param {string} number - The raw 10-digit string (e.g., "9876543210").
   * @param {'phone' | 'mobile'} format - The required format type.
   * @returns {string} The formatted string (e.g., "98765 43210").
   */
  const formatPhoneNumber = (number, format) => {
    const digits = String(number || '').replace(/\D/g, '')
    if (digits.length === 0) return ''

    // ... (phone formatting logic)

    if (format === 'mobile') {
      // Apply 5 + 5 format: XXXXX XXXXX
      let formatted = ''
      formatted += digits.substring(0, 5) // First 5 digits
      if (digits.length > 5) formatted += ` ${digits.substring(5, 10)}` // Space + next 5 digits

      return formatted
    }

    return digits
  }

  const openPreview = image => {
    if (!image) return
    setPreviewImage(getLogoSrc(image))
    setPreviewOpen(true)
  }

  const closePreview = () => {
    setPreviewOpen(false)
    setPreviewImage(null)
  }

  // ✅ FIX: Use dedicated refs for each file input
  const logoInputRef = useRef(null)
  const logoSmallInputRef = useRef(null)
  const logoInvoiceInputRef = useRef(null)

  const [data, setData] = useState({
    name: '',
    company_code: '',
    prefix: '',
    capital: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    contact_person: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    gst: '',
    cin: '',
    statecode: '',
    mobile: '',
    fax: '',
    logo: '',
    logo_small: '',
    logo_invoice: ''
  })

  const [touched, setTouched] = useState({})

  const inputRefs = useRef([])
  const submitButtonRef = useRef(null)

  const fieldOrder = [
    'name',
    'company_code',
    'email',
    'gst',
    'cin',
    'statecode',
    'address_line_1',
    'address_line_2',
    'city',
    'state',
    'pincode',
    'phone',
    'mobile',
    'fax',
    'logo',
    'logo_small',
    'logo_invoice'
  ]

  const getRefIndex = field => fieldOrder.indexOf(field)

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const nextIndex = index + 1

      if (nextIndex < inputRefs.current.length) {
        let nextRef = inputRefs.current[nextIndex]
        let currentNextIndex = nextIndex

        while (!nextRef && currentNextIndex < inputRefs.current.length) {
          currentNextIndex++
          nextRef = inputRefs.current[currentNextIndex]
        }

        if (nextRef) {
          nextRef.focus()
        } else {
          submitButtonRef.current?.focus()
        }
      } else {
        submitButtonRef.current?.focus()
      }
    }
  }

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = phone => String(phone || '').replace(/\D/g, '').length === 10
  const validatePincode = pincode => String(pincode || '').length === 6

  const getErrorMessage = (field, value) => {
    // For phone/mobile validation, use the stored raw value (which is limited to 10 digits in handleChange)
    const rawValue = String(value || '').replace(/\D/g, '')

    if (field === 'email' && value && !validateEmail(value)) return 'Invalid email'
    if (field === 'mobile' && rawValue && !validatePhone(value)) return 'Mobile must be 10 digits'
    if (field === 'phone' && rawValue && !validatePhone(value)) return 'Phone must be 10 digits'
    if (field === 'pincode' && value && !validatePincode(value)) return 'Pincode must be 6 digits'

    return ''
  }

  const handleChange = (field, value) => {
    if (['phone', 'mobile'].includes(field)) {
      // ✅ Restrict phone/mobile input to only digits and max 10 length
      const digits = String(value || '').replace(/\D/g, '')

      if (digits.length <= 10) {
        setData(prev => ({ ...prev, [field]: digits })) // Store raw digits in state
      }
    } else {
      setData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleBlur = field => setTouched(prev => ({ ...prev, [field]: true }))

  const loadFromIndexedDB = async id => {
    try {
      const db = await getCompanyDB()
      const existing = await db.get('companies', id)

      if (existing) {
        // Ensure phone/mobile are stored/loaded as raw digits if they were stored formatted
        setData(existing)
        setEditCompanyId(existing.id)
      }
    } catch (err) {
      console.error('Error loading from IndexedDB:', err)
    }
  }

  const fetchCompanyData = async () => {
    try {
      setLoading(true)
      const data = await getCompanyData()

      if (Object.keys(data).length) {
        const normalizedData = {
          name: data.name || '',
          company_code: data.company_code || '',
          email: data.email || '',
          gst: data.gst || '',
          cin: data.cin || '',
          statecode: data.statecode || '',
          address_line_1: data.address_line_1 || '',
          address_line_2: data.address_line_2 || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          phone: String(data.phone || '').replace(/\D/g, ''),
          mobile: String(data.mobile || '').replace(/\D/g, ''),
          fax: data.fax || '',
          logo: data.logo || '',
          logo_small: data.logo_small || '',
          logo_invoice: data.logo_invoice || ''
        }

        // Remove file objects from IDB if any (sanity check)
        const idbData = { ...normalizedData }
        if (idbData.logo instanceof File) idbData.logo = ''
        if (idbData.logo_small instanceof File) idbData.logo_small = ''
        if (idbData.logo_invoice instanceof File) idbData.logo_invoice = ''

        setData(normalizedData)
        setInitialData(normalizedData) // 🔥 IMPORTANT
        setIsDirty(false) // 🔒 Disable update
        setEditCompanyId(data.id)

        // Update IDB with fresh data
        const db = await getCompanyDB()
        await db.put('companies', { ...idbData, id: data.id })
      } else {
        loadFromIndexedDB(1)
      }
    } catch (err) {
      if (err.response?.status === 401) {
        showToast('warning', 'Session expired. Please login again.', 'error')

        router.push('/login')

        return
      }

      console.error('API fetch failed:', err)

      showToast('error', 'Failed to fetch company data.')

      loadFromIndexedDB(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!initialData) return

    const hasChanges = Object.keys(initialData).some(key => {
      const current = data[key]
      const initial = initialData[key]

      // File compare
      if (current instanceof File) return true

      return current !== initial
    })

    setIsDirty(hasChanges)
  }, [data, initialData])

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const handleReset = () => {
    setTouched({})
    fetchCompanyData()
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const db = await getCompanyDB()
      const formData = new FormData()
      const companyId = editCompanyId || 1

      // 🔴 REQUIRED FIELDS (MUST MATCH BACKEND)
      const REQUIRED_FIELDS = ['name', 'company_code', 'email', 'mobile', 'city', 'state']

      REQUIRED_FIELDS.forEach(key => {
        if (data[key]) {
          formData.append(key, data[key])
        }
      })

      // 🟡 OPTIONAL TEXT FIELDS
      const OPTIONAL_FIELDS = ['gst', 'cin', 'statecode', 'address_line_1', 'address_line_2', 'pincode', 'phone', 'fax']

      OPTIONAL_FIELDS.forEach(key => {
        if (data[key]) {
          formData.append(key, data[key])
        }
      })

      // 🟢 FILE UPLOADS (ONLY IF USER SELECTED)
      if (data.logo instanceof File) {
        formData.append('logo', data.logo)
      }

      if (data.logo_small instanceof File) {
        formData.append('logo_small', data.logo_small)
      }

      if (data.logo_invoice instanceof File) {
        formData.append('logo_invoice', data.logo_invoice)
      }

      // ✅ DEBUG (REMOVE LATER)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      const updatedData = await updateCompanyData(companyId, formData)

      // 🔥 MERGE BACKEND IMAGE URLS
      const mergedData = {
        ...data,
        ...updatedData
      }

      setData(mergedData)
      setInitialData(mergedData)
      setIsDirty(false)

      // ✅ STORE ONLY STRINGS IN INDEXEDDB
      const idbData = { ...mergedData }
      if (idbData.logo instanceof File) idbData.logo = ''
      if (idbData.logo_small instanceof File) idbData.logo_small = ''
      if (idbData.logo_invoice instanceof File) idbData.logo_invoice = ''

      await db.put('companies', { ...idbData, id: companyId })

      showToast('success', 'Company updated successfully!')
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.message ||'error', 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to display the file name/status
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

  // Helper function to get the display source for the image preview
  const getLogoSrc = fileValue => {
    if (typeof window === 'undefined') return null

    if (fileValue instanceof File) {
      return URL.createObjectURL(fileValue)
    }

    if (typeof fileValue === 'string' && fileValue) {
      // If absolute URL, return as is
      if (fileValue.startsWith('http')) {
        return `${fileValue}?t=${Date.now()}`
      }
      // If relative, prepend API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || ''
      return `${apiUrl}${fileValue.startsWith('/') ? '' : '/'}${fileValue}?t=${Date.now()}`
    }

    return null
  }

  return (
    <Card sx={{ p: '1.5rem' }}>
      {/* Header and Breadcrumbs (unchanged) */}
      <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Company</span>
        </div>

        <div
          style={{
            fontSize: 14,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Link href='/' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
            <Box display='flex' alignItems='center' gap={1}>
              <i className='tabler-smart-home' style={{ fontSize: 20 }} />
            </Box>
          </Link>
          {' / '}
          <Link href='/masters' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
            Masters
          </Link>
          {' / '}
          <Link href='/company' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
            Company
          </Link>
        </div>
      </div>

      {/* --- */}

      <div>
        <CardContent sx={{ padding: 0, mt: 5 }}>
          <form onSubmit={e => e.preventDefault()}>
            <Grid container spacing={6}>
              {/* Company Name (Required) - Index 0 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label='Name'
                  value={data.name}
                  InputProps={{ readOnly: true }} // ✅ replaced disabled with readOnly
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  error={touched.name && getErrorMessage('name', data.name) !== ''}
                  helperText={touched.name && getErrorMessage('name', data.name)}
                  inputRef={el => (inputRefs.current[getRefIndex('name')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('name'))}
                />
              </Grid>

              {/* Company Code (Required) - Index 1 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={<>Company Code</>}
                  value={data.company_code}
                  onChange={e => handleChange('company_code', e.target.value)}
                  onBlur={() => handleBlur('company_code')}
                  error={touched.company_code && getErrorMessage('company_code', data.company_code) !== ''}
                  helperText={touched.company_code && getErrorMessage('company_code', data.company_code)}
                  inputRef={el => (inputRefs.current[getRefIndex('company_code')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('company_code'))}
                />
              </Grid>

              {/* Email (Required & Valid Email) - Index 2 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={<>Email</>}
                  value={data.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={touched.email && getErrorMessage('email', data.email) !== ''}
                  helperText={touched.email && getErrorMessage('email', data.email)}
                  inputRef={el => (inputRefs.current[getRefIndex('email')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('email'))}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={<>GSTIN</>}
                  value={data.gst}
                  onChange={e => handleChange('gst', e.target.value)}
                  onBlur={() => handleBlur('gst')}
                  error={touched.gst && getErrorMessage('gst', data.gst) !== ''}
                  helperText={touched.gst && getErrorMessage('gst', data.gst)}
                  inputRef={el => (inputRefs.current[getRefIndex('gst')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('gst'))}
                />
              </Grid>

              {/* CIN (Optional) - Index 4 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label='CIN'
                  value={data.cin}
                  onChange={e => handleChange('cin', e.target.value)}
                  inputRef={el => (inputRefs.current[getRefIndex('cin')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('cin'))}
                />
              </Grid>

              {/* State Code (Optional) - Index 5 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label='State Code'
                  value={data.statecode}
                  onChange={e => handleChange('statecode', e.target.value)}
                  inputRef={el => (inputRefs.current[getRefIndex('statecode')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('statecode'))}
                />
              </Grid>

              {/* Address Line 1 (Required) - Index 6 (Multiline) */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={<>Address Line 1</>}
                  multiline
                  type='textarea'
                  rows={3}
                  value={data.address_line_1}
                  onChange={e => handleChange('address_line_1', e.target.value)}
                  onBlur={() => handleBlur('address_line_1')}
                  error={touched.address_line_1 && getErrorMessage('address_line_1', data.address_line_1) !== ''}
                  helperText={touched.address_line_1 && getErrorMessage('address_line_1', data.address_line_1)}
                  inputRef={el => (inputRefs.current[getRefIndex('address_line_1')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('address_line_1'))}
                />
              </Grid>

              {/* Address Line 2 (Optional) - Index 7 (Multiline) */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label=' Address Line 2'
                  multiline
                  rows={3}
                  type='textarea'
                  value={data.address_line_2}
                  onChange={e => handleChange('address_line_2', e.target.value)}
                  inputRef={el => (inputRefs.current[getRefIndex('address_line_2')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('address_line_2'))}
                />
              </Grid>

              {/* City (Required) - Index 8 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={<>City</>}
                  value={data.city}
                  onChange={e => handleChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  error={touched.city && getErrorMessage('city', data.city) !== ''}
                  helperText={touched.city && getErrorMessage('city', data.city)}
                  inputRef={el => (inputRefs.current[getRefIndex('city')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('city'))}
                />
              </Grid>

              {/* State (Required) - Index 9 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={<>State</>}
                  value={data.state}
                  onChange={e => handleChange('state', e.target.value)}
                  onBlur={() => handleBlur('state')}
                  error={touched.state && getErrorMessage('state', data.state) !== ''}
                  helperText={touched.state && getErrorMessage('state', data.state)}
                  inputRef={el => (inputRefs.current[getRefIndex('state')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('state'))}
                />
              </Grid>

              {/* Pin Code (Optional, 6 digits validation) - Index 10 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label='Pin Code'
                  value={data.pincode}
                  onChange={e => handleChange('pincode', e.target.value)}
                  onBlur={() => handleBlur('pincode')}
                  error={touched.pincode && getErrorMessage('pincode', data.pincode) !== ''}
                  helperText={touched.pincode && getErrorMessage('pincode', data.pincode)}
                  inputRef={el => (inputRefs.current[getRefIndex('pincode')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('pincode'))}
                />
              </Grid>

              {/* Phone (Optional, 3 + 7 digits formatting) - Index 11 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label='Phone'
                  value={data.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  error={touched.phone && getErrorMessage('phone', data.phone) !== ''}
                  helperText={touched.phone && getErrorMessage('phone', data.phone)}
                  inputRef={el => (inputRefs.current[getRefIndex('phone')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('phone'))}
                />
              </Grid>

              {/* Mobile (Required & 5 + 5 digits formatting) - Index 12 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={<>Mobile</>}
                  value={formatPhoneNumber(data.mobile, 'mobile')}
                  onChange={e => handleChange('mobile', e.target.value)}
                  onBlur={() => handleBlur('mobile')}
                />
              </Grid>

              {/* Fax (Required) - Index 13 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={<>Fax</>}
                  value={data.fax}
                  onChange={e => handleChange('fax', e.target.value)}
                  onBlur={() => handleBlur('fax')}
                  error={touched.fax && getErrorMessage('fax', data.fax) !== ''}
                  helperText={touched.fax && getErrorMessage('fax', data.fax)}
                  inputRef={el => (inputRefs.current[getRefIndex('fax')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('fax'))}
                />
              </Grid>

              {/* Logo Upload (Index 14) */}

              {/* <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Logo
                  </Typography>

                  <input
                  src='data.logo'
                    type='file'
                    style={{ display: 'none' }}
                    ref={logoInputRef}
                    onChange={e => {
                      const file = e.target.files?.[0] || ''

                      setData(prev => ({ ...prev, logo: file }))
                    }}

                  />

                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={() => logoInputRef.current?.click()}
                    sx={{
                      justifyContent: 'center',
                      borderStyle: 'solid',
                      borderWidth: 1,
                      padding: 1.5,
                      textTransform: 'none'
                    }}
                  >
                    {getFileDisplay(data.logo)}
                  </Button>
                </Box>
              </Grid> */}

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <label style={{ fontSize: '0.8rem', color: '#111' }}>Logo</label>

                  <input
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    ref={logoInputRef}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return

                      if (file.size > MAX_FILE_SIZE) {
                        showToast('error', 'Logo must be under 1MB' )
                        return
                      }

                      setData(prev => ({ ...prev, logo: file }))
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant='outlined'
                      fullWidth
                      onClick={() => logoInputRef.current?.click()}
                      sx={{ height: 38, textTransform: 'none' }}
                    >
                      {data.logo ? 'Change Logo' : 'Click to Upload'}
                    </Button>

                    <IconButton onClick={() => openPreview(data.logo)} disabled={!data.logo}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>

              {/* Logo Small Upload (Index 15) */}
              {/* <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Small Logo
                  </Typography>

                  <input
                    type='file'
                    style={{ display: 'none' }}
                    ref={logoSmallInputRef}
                    onChange={e => {
                      const file = e.target.files?.[0] || ''

                      setData(prev => ({ ...prev, logo_small: file }))
                    }}
                  />

                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={() => logoSmallInputRef.current?.click()}
                    sx={{
                      justifyContent: 'center',
                      borderStyle: 'solid',
                      borderWidth: 1,
                      padding: 1.5,
                      textTransform: 'none'
                    }}
                  >
                    {getFileDisplay(data.logo_small)}
                  </Button>
                </Box>
              </Grid> */}

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <label style={{ fontSize: '0.8rem', color: '#111' }}>Small Logo</label>

                  <input
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    ref={logoSmallInputRef}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setData(prev => ({ ...prev, logo_small: file }))
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant='outlined'
                      fullWidth
                      onClick={() => logoSmallInputRef.current?.click()}
                      sx={{ height: 38, textTransform: 'none' }}
                    >
                      {data.logo_small ? 'Change Small Logo' : 'Click to Upload'}
                    </Button>

                    <IconButton onClick={() => openPreview(data.logo_small)} disabled={!data.logo_small}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>

              {/* Logo Invoice Upload (Index 16) */}
              {/* <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Logo Invoice
                  </Typography>

                  <input
                    type='file'
                    style={{ display: 'none' }}
                    ref={logoInvoiceInputRef}
                    onChange={e => {
                      const file = e.target.files?.[0] || ''

                      setData(prev => ({ ...prev, logo_invoice: file }))
                    }}
                  />

                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={() => logoInvoiceInputRef.current?.click()}
                    sx={{
                      justifyContent: 'center',
                      borderStyle: 'solid',
                      borderWidth: 1,
                      padding: 1.5,
                      textTransform: 'none'
                    }}
                  >
                    {getFileDisplay(data.logo_invoice)}
                  </Button>
                </Box>
              </Grid> */}

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <label style={{ fontSize: '0.8rem', color: '#111' }}>Logo Invoice</label>

                  <input
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    ref={logoInvoiceInputRef}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setData(prev => ({ ...prev, logo_invoice: file }))
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant='outlined'
                      fullWidth
                      onClick={() => logoInvoiceInputRef.current?.click()}
                      sx={{ height: 38, textTransform: 'none' }}
                    >
                      {data.logo_invoice ? 'Change Invoice Logo' : 'Click to Upload'}
                    </Button>

                    <IconButton onClick={() => openPreview(data.logo_invoice)} disabled={!data.logo_invoice}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Buttons */}
            <Grid container spacing={2} justifyContent='flex-end' sx={{ mt: 4 }}>
              <Grid>
                <Button
                  variant='outlined'
                  sx={{
                    borderColor: theme.palette.text.primary,
                    color: theme.palette.text.primary,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: theme.palette.text.primary,
                      backgroundColor: 'rgba(33, 44, 98, 0.08)'
                    }
                  }}
                  onClick={handleReset}
                >
                  Back
                </Button>
              </Grid>
              <Grid>
                <Button
                  type='submit'
                  variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
                  sx={{
                    textTransform: 'none',

                    backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
                    color:
                      theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(33, 44, 98, 0.08)',
                      borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
                    }
                  }}
                  onClick={handleSubmit}
                  ref={submitButtonRef}
                  disabled={loading || !isDirty}
                >
                  {loading ? 'Updating...' : 'Update'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
      <GlobalDialog open={previewOpen} title='Image Preview' onClose={closePreview} hideActions maxWidth='sm'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 300
          }}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt='Preview'
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 8
              }}
            />
          ) : (
            <Typography variant='body2' color='text.secondary'>
              No image available
            </Typography>
          )}
        </Box>
      </GlobalDialog>
    </Card>
  )
}

export default Company
