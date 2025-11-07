'use client'

import { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { openDB } from 'idb'
import axios from 'axios'
import { toast } from 'react-toastify'

// MUI imports
import { styled, useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Box } from '@mui/material'

import Link from '@/components/Link'
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderSingle from './FileUploaderSingle'

// ✅ Fetch with Auth helper
async function fetchWithAuth(url, options = {}) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNDk2NDk1LCJpYXQiOjE3NjE4OTE2OTUsImp0aSI6IjE5OTFmZDQzM2ExNDRkODFhMjY3NzViNTlmMWQ2YTFmIiwidXNlcl9pZCI6MX0.0DIgCY39dTnMjcnYa7u42QLkYtBI4c28tasI7no2q8M'

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  const response = await fetch(url, { ...options, headers })

  return response
}

// 🔹 Label with required star
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

// IndexedDB setup
const getCompanyDB = async () => {
  return openDB('companyDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('companies')) {
        db.createObjectStore('companies', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

const API_BASE_URL = 'http://motor-match.genplusinnovations.com:7023/api/company/'

const API_ENDPOINTS = {
  list: `${API_BASE_URL}list/`,
  update: id => `${API_BASE_URL}update/${id}/`
}

const Company = () => {
  const theme = useTheme()
  const router = ''
  const [loading, setLoading] = useState(false)
  const [editCompanyId, setEditCompanyId] = useState(null)

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

  // ✅ Refs for focus handling
  const inputRefs = useRef([])
  const submitButtonRef = useRef(null)

  // ✅ Field index map for keyboard navigation
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
    'fax'
  ]

  const getRefIndex = field => fieldOrder.indexOf(field)

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const nextIndex = index + 1

      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex]?.focus()
      } else {
        submitButtonRef.current?.focus()
      }
    }
  }

  const requiredFields = ['name', 'company_code', 'email', 'address_line_1', 'city', 'state', 'gst', 'mobile', 'fax']

  // --- Validation ---
  const validateRequired = value => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim() !== ''
    if (typeof value === 'object' && value instanceof File) return true

    return false
  }

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = phone => phone.replace(/\D/g, '').length === 10
  const validatePincode = pincode => pincode.length === 6

  const getErrorMessage = (field, value) => {
    const isRequired = requiredFields.includes(field)

    if (isRequired && !validateRequired(value)) return `${field.replace(/([A-Z])/g, ' $1').trim()} is required`
    if (field === 'email' && value && !validateEmail(value)) return 'Invalid email'
    if (field === 'mobile' && value && !validatePhone(value)) return 'Mobile must be 10 digits'
    if (field === 'pincode' && value && !validatePincode(value)) return 'Pincode must be 6 digits'

    return ''
  }

  // --- Input Handlers ---
  const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }))

  const handleFileChange = (field, file) => {
    setData(prev => ({ ...prev, [field]: file }))
  }

  const handleBlur = field => setTouched(prev => ({ ...prev, [field]: true }))

  // --- IndexedDB & API ---
  const loadFromIndexedDB = async id => {
    try {
      const db = await getCompanyDB()
      const existing = await db.get('companies', id)

      if (existing) {
        setData(existing)
        setEditCompanyId(existing.id)
      }
    } catch (err) {
      console.error('Error loading from IndexedDB:', err)
    }
  }

  const fetchCompanyData = async () => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNDk2NDk1LCJpYXQiOjE3NjE4OTE2OTUsImp0aSI6IjE5OTFmZDQzM2ExNDRkODFhMjY3NzViNTlmMWQ2YTFmIiwidXNlcl9pZCI6MX0.0DIgCY39dTnMjcnYa7u42QLkYtBI4c28tasI7no2q8M'

      if (!token) {
        toast.error('Authentication token missing. Please login again.')
        router.push('/login')

        return
      }

      setLoading(true)
      const response = await fetchWithAuth(API_ENDPOINTS.list, { method: 'GET' })

      if (response.status === 401) {
        toast.error('Session expired. Please login again.')
        router.push('/login')

        return
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const responseData = await response.json()
      const data = responseData?.[0] || responseData?.data?.[0] || {}

      if (Object.keys(data).length) {
        setData(prev => ({
          ...prev,
          name: data.name || data.name || '',
          company_code: data.company_code || data.company_code || '',
          email: data.email || '',
          gst: data.gst || '',
          cin: data.cin || '',
          statecode: data.statecode || '',
          address_line_1: data.address_line_1 || '',
          address_line_2: data.address_line_2 || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          phone: data.phone || '',
          mobile: data.mobile || '',
          fax: data.fax || '',
          logo: data.logo || null,
          logo_small: data.logo_small || null,
          logo_invoice: data.logo_invoice || null
        }))
        setEditCompanyId(data.id)
        console.log('Fetched from API')
      } else {
        console.warn('No API data; fallback to IndexedDB')
        loadFromIndexedDB(1)
      }
    } catch (err) {
      console.error('API fetch failed:', err)
      toast.error('Failed to fetch company data.')
      loadFromIndexedDB(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const handleReset = () => {
    setTouched({})
    fetchCompanyData()
  }

  const handleSubmit = async () => {
    const newTouched = requiredFields.reduce((acc, f) => ({ ...acc, [f]: true }), {})

    setTouched(newTouched)

    const isFormValid = requiredFields.every(field => getErrorMessage(field, data[field]) === '')

    if (!isFormValid) return toast.error('Please fill all required fields correctly.')

    try {
      const db = await getCompanyDB()

      const formData = new FormData()

      formData.append('id', editCompanyId || 1)
      formData.append('name', data.name)
      formData.append('company_code', data.company_code)
      formData.append('email', data.email)
      formData.append('gst', data.gst)
      formData.append('cin', data.cin)
      formData.append('statecode', data.statecode)
      formData.append('address_line_1', data.address_line_1)
      formData.append('address_line_2', data.address_line_2)
      formData.append('city', data.city)
      formData.append('state', data.state)
      formData.append('pincode', data.pincode)
      formData.append('phone', data.phone)
      formData.append('mobile', data.mobile)
      formData.append('fax', data.fax)

      // ✅ Append images only if user selected them
      if (data.logo instanceof File) formData.append('logo', data.logo)
      if (data.logo_small instanceof File) formData.append('logo_small', data.logo_small)
      if (data.logo_invoice instanceof File) formData.append('logo_invoice', data.logo_invoice)

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNDk2NDk1LCJpYXQiOjE3NjE4OTE2OTUsImp0aSI6IjE5OTFmZDQzM2ExNDRkODFhMjY3NzViNTlmMWQ2YTFmIiwidXNlcl9pZCI6MX0.0DIgCY39dTnMjcnYa7u42QLkYtBI4c28tasI7no2q8M'

      const response = await fetch(API_ENDPOINTS.update(editCompanyId || 1), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`

          // ❌ Don't set 'Content-Type' — browser sets it automatically for FormData
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()

        console.error('Update failed body:', errorText)
        throw new Error(`Update failed: ${response.status}`)
      }

      const updatedData = await response.json()

      setData(prev => ({ ...prev, ...updatedData }))
      await db.put('companies', { ...data, ...updatedData, id: editCompanyId || 1 })

      toast.success('Company updated successfully!')
    } catch (err) {
      console.error('Error updating company:', err)
      toast.error(`Error updating company: ${err.message}`)
    }
  }

  // if (loading) return <Typography>Loading Company Data...</Typography>

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
                  label={
                    <>
                      Name
                      <LabelWithStar />
                    </>
                  }
                  disabled
                  value={data.name}
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
                  label={
                    <>
                      Company Code
                      <LabelWithStar />
                    </>
                  }
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
                  label={
                    <>
                      Email
                      <LabelWithStar />
                    </>
                  }
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
                  label={
                    <>
                      GSTIN
                      <LabelWithStar />
                    </>
                  }
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
                  label={
                    <>
                      Address Line 1<LabelWithStar />
                    </>
                  }
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
                  label={
                    <>
                      City
                      <LabelWithStar />
                    </>
                  }
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
                  label={
                    <>
                      State
                      <LabelWithStar />
                    </>
                  }
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
                  label={
                    <>
                      Mobile
                      <LabelWithStar />
                    </>
                  }
                  value={data.mobile}
                  onChange={e => handleChange('mobile', e.target.value)}
                  onBlur={() => handleBlur('mobile')}
                  error={touched.mobile && getErrorMessage('mobile', data.mobile) !== ''}
                  helperText={touched.mobile && getErrorMessage('mobile', data.mobile)}
                  inputRef={el => (inputRefs.current[getRefIndex('mobile')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('mobile'))}
                />
              </Grid>

              {/* Fax (Required) - Index 13 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <CustomTextField
                  fullWidth
                  label={
                    <>
                      <LabelWithStar /> Fax
                    </>
                  }
                  value={data.fax}
                  onChange={e => handleChange('fax', e.target.value)}
                  onBlur={() => handleBlur('fax')}
                  error={touched.fax && getErrorMessage('fax', data.fax) !== ''}
                  helperText={touched.fax && getErrorMessage('fax', data.fax)}
                  inputRef={el => (inputRefs.current[getRefIndex('fax')] = el)}
                  onKeyDown={e => handleKeyDown(e, getRefIndex('fax'))}
                />
              </Grid>

              {/* Logo (Required File) */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  value={data.logo}
                  variant='caption'
                  component='label'
                  sx={{ display: 'block', fontWeight: 400, color: 'text.primary' }}
                >
                  <LabelWithStar /> Logo
                </Typography>
                <FileUploaderSingle onFileChange={files => handleFileChange('logo', files)} />
                {touched.logo && getErrorMessage('logo', data.logo) && (
                  <Typography variant='caption' color='error'>
                    {getErrorMessage('logo', data.logo)}
                  </Typography>
                )}
              </Grid>

              {/* Logo Small (Required File) */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant='caption'
                  component='label'
                  sx={{ display: 'block', fontWeight: 400, color: 'text.primary' }}
                >
                  <LabelWithStar /> Logo Small
                </Typography>
                <FileUploaderSingle onFileChange={files => handleFileChange('logo_small', files)} />
                {touched.logo_small && getErrorMessage('logo_small', data.logo_small) && (
                  <Typography variant='caption' color='error'>
                    {getErrorMessage('logo_small', data.logo_small)}
                  </Typography>
                )}
              </Grid>

              {/* Logo Invoice (Required File) */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant='caption'
                  component='label'
                  sx={{ display: 'block', fontWeight: 400, color: 'text.primary' }}
                >
                  <LabelWithStar /> Logo Invoice
                </Typography>
                <FileUploaderSingle onFileChange={files => handleFileChange('logo_invoice', files)} />
                {touched.logo_invoice && getErrorMessage('logo_invoice', data.logo_invoice) && (
                  <Typography variant='caption' color='error'>
                    {getErrorMessage('logo_invoice', data.logo_invoice)}
                  </Typography>
                )}
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
                      backgroundColor: 'rgba(33, 44, 98, 0.08)' // optional: you can also make this dynamic with theme if needed
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
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </Card>
  )
}

export default Company
