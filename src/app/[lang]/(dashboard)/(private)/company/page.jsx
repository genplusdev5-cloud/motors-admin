'use client'

import { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { openDB } from 'idb'
import { toast } from 'react-toastify'

// MUI imports
import { styled, useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Box } from '@mui/material'

import { getCompanyData, updateCompanyData } from '@/services/companyApi' // Assuming you rename the service file
import Link from '@/components/Link'
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderSingle from './FileUploaderSingle'

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
  const fileInputRef = useRef(null) // ✅ Add this

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
    'logo_invoice',
    'logo_small'
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
  } // --- Simple validation (no required fields)

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = phone => phone.replace(/\D/g, '').length === 10
  const validatePincode = pincode => pincode.length === 6

  const getErrorMessage = (field, value) => {
    if (field === 'email' && value && !validateEmail(value)) return 'Invalid email'
    if (field === 'mobile' && value && !validatePhone(value)) return 'Mobile must be 10 digits'
    if (field === 'pincode' && value && !validatePincode(value)) return 'Pincode must be 6 digits'

    return ''
  }

  const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }))

  const handleFileChange = (field, file) => {
    const actualFile = Array.isArray(file) ? file[0] : file

    setData(prev => ({ ...prev, [field]: actualFile }))
  }

  const handleBlur = field => setTouched(prev => ({ ...prev, [field]: true }))

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
      setLoading(true)
      const data = await getCompanyData() // API call to get company data

      if (Object.keys(data).length) {
        setData(prev => ({
          ...prev,
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
          phone: data.phone || '',
          mobile: data.mobile || '',
          fax: data.fax || '',
          logo: data.logo || '',
          logo_small: data.logo_small || '',
          logo_invoice: data.logo_invoice || ''
        }))
        setEditCompanyId(data.id)
      } else {
        loadFromIndexedDB(1)
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.')
        router.push('/login')

        return
      }

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
    try {
      setLoading(true)
      const db = await getCompanyDB()
      const formData = new FormData() // Use the existing ID or default to 1 for the update payload

      const companyId = editCompanyId || 1 // Append all fields (including files and strings) to FormData

      Object.entries(data).forEach(([key, value]) => {
        // Only append 'id' if the server expects it within the payload
        if (key === 'id') return
        if (value instanceof File) formData.append(key, value)
        else formData.append(key, value ?? '')
      })

      // CRITICAL FIX: Pass the ID as the first argument and the FormData payload as the second.
      const updatedData = await updateCompanyData(companyId, formData)

      setData(prev => ({ ...prev, ...updatedData }))
    
      await db.put('companies', { ...data, ...updatedData, id: companyId })

      toast.success('Company updated successfully!')
    } catch (err) {
      console.error('Error updating company:', err)
      toast.error(err.message || 'Error updating company.')
    } finally {
      setLoading(false)
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
                  label={<>Name</>}
                  value={data.name}
                  disabled
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

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Logo
                  </Typography>

                  <input
                    type='file'
                    style={{ display: 'none' }}
                    ref={fileInputRef} // ✅ defined useRef
                    onChange={e => {
                      const file = e.target.files?.[0] || null

                      setData(prev => ({ ...prev, logo: file }))
                    }}
                  />

                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      justifyContent: 'center',
                      borderStyle: 'solid',
                      borderWidth: 1,
                      padding: 1.5,
                      textTransform: 'none'
                    }}
                  >
                    {data.logo ? data.logo.name : 'Click to Upload'}
                  </Button>
                </Box>
              </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                    Small Logo
                  </Typography>

                  <input
                    type='file'
                    style={{ display: 'none' }}
                    ref={fileInputRef} // ✅ defined useRef
                    onChange={e => {
                      const file = e.target.files?.[0] || null

                      setData(prev => ({ ...prev, logo_small: file }))
                    }}
                  />

                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      justifyContent: 'center',
                      borderStyle: 'solid',
                      borderWidth: 1,
                      padding: 1.5,
                      textTransform: 'none'
                    }}
                  >
                    {data.logo_small ? data.logo_small.name : 'Click to Upload'}
                  </Button>
                </Box>
              </Grid>

                {/* <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
                     Logo Invoice
                  </Typography>

                  <input
                    type='file'
                    style={{ display: 'none' }}
                    ref={fileInputRef} // ✅ defined useRef
                    onChange={e => {
                      const file = e.target.files?.[0] || null

                      setData(prev => ({ ...prev, logo_invoice: file }))
                    }}
                  />

                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      justifyContent: 'center',
                      borderStyle: 'solid',
                      borderWidth: 1,
                      padding: 1.5,
                      textTransform: 'none'
                    }}
                  >
                    {data.logo_invoice ? data.logo_invoice.name : 'Click to Upload'}
                  </Button>
                </Box>
              </Grid> */}

              {/* Logo (Required File) */}
              {/* <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant='caption'
                  component='label'
                  sx={{ display: 'block', fontWeight: 400, color: 'text.primary' }}
                >
                  Logo
                </Typography>

                <FileUploaderSingle onFileChange={files => handleFileChange('logo', files)} initialFile={data.logo} />
                {touched.logo && getErrorMessage('logo', data.logo) && (
                  <Typography variant='caption' color='error'>
                    {getErrorMessage('logo', data.logo)}
                  </Typography>
                )}
              </Grid> */}

              {/* Logo Small (Required File) */}
              {/* <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant='caption'
                  component='label'
                  sx={{ display: 'block', fontWeight: 400, color: 'text.primary' }}
                >
                  Logo Small
                </Typography>
                <FileUploaderSingle
                  onFileChange={files => handleFileChange('logo_small', files)}
                  initialFile={data.logo_small}
                />
                {touched.logo_small && getErrorMessage('logo_small', data.logo_small) && (
                  <Typography variant='caption' color='error'>
                    {getErrorMessage('logo_small', data.logo_small)}
                  </Typography>
                )}
              </Grid> */}

              {/* Logo Invoice (Required File) */}
              {/* <Grid size={{ xs: 12, sm: 4 }}>
                <Typography
                  variant='caption'
                  component='label'
                  sx={{ display: 'block', fontWeight: 400, color: 'text.primary' }}
                >
                  Logo Invoice
                </Typography>
                <FileUploaderSingle
                  onFileChange={files => handleFileChange('logo_invoice', files)}
                  initialFile={data.logo_invoice}
                />
                {touched.logo_invoice && getErrorMessage('logo_invoice', data.logo_invoice) && (
                  <Typography variant='caption' color='error'>
                    {getErrorMessage('logo_invoice', data.logo_invoice)}
                  </Typography>
                )}
              </Grid> */}
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

// ----------------------correct file code with apis ----------------------------------------------------

// 'use client'

// import { useState, useEffect, useRef } from 'react'

// import { useRouter } from 'next/navigation'

// import { openDB } from 'idb'
// import { toast } from 'react-toastify'

// // MUI imports
// import { styled, useTheme } from '@mui/material/styles'
// import Grid from '@mui/material/Grid2'
// import Button from '@mui/material/Button'
// import Typography from '@mui/material/Typography'
// import Card from '@mui/material/Card'
// import CardContent from '@mui/material/CardContent'
// import { Box } from '@mui/material'

// // Assuming this path to your services file
// import { getCompanyData, updateCompanyData } from '@/services/companyApi'
// import Link from '@/components/Link'
// import CustomTextField from '@core/components/mui/TextField'

// // --- Label styling (unchanged)
// const LabelWithStar = styled('span')({
//   '&::before': {
//     content: '"*"',
//     color: 'red',
//     marginRight: 4
//   }
// })

// // --- IndexedDB setup (unchanged)
// const getCompanyDB = async () => {
//   return openDB('companyDB', 1, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains('companies')) {
//         db.createObjectStore('companies', { keyPath: 'id', autoIncrement: true })
//       }
//     }
//   })
// }

// const Company = () => {
//   const theme = useTheme()
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [editCompanyId, setEditCompanyId] = useState(null)

//   // ✅ FIX: Use dedicated refs for each file input
//   const logoInputRef = useRef(null)
//   const logoSmallInputRef = useRef(null)
//   const logoInvoiceInputRef = useRef(null)

//   const [data, setData] = useState({
//     name: '',
//     company_code: '',
//     prefix: '',
//     capital: '',
//     email: '',
//     city: '',
//     state: '',
//     pincode: '',
//     contact_person: '',
//     phone: '',
//     address_line_1: '',
//     address_line_2: '',
//     gst: '',
//     cin: '',
//     statecode: '',
//     mobile: '',
//     fax: '',
//     logo: '',
//     logo_small: '',
//     logo_invoice: ''
//   })

//   const [touched, setTouched] = useState({})

//   const inputRefs = useRef([])
//   const submitButtonRef = useRef(null)

//   const fieldOrder = [
//     'name',
//     'company_code',
//     'email',
//     'gst',
//     'cin',
//     'statecode',
//     'address_line_1',
//     'address_line_2',
//     'city',
//     'state',
//     'pincode',
//     'phone',
//     'mobile',
//     'fax',
//     'logo',
//     'logo_small',
//     'logo_invoice'
//   ]

//   const getRefIndex = field => fieldOrder.indexOf(field)

//   const handleKeyDown = (e, index) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       const nextIndex = index + 1

//       if (nextIndex < inputRefs.current.length) {
//         let nextRef = inputRefs.current[nextIndex]
//         let currentNextIndex = nextIndex

//         while (!nextRef && currentNextIndex < inputRefs.current.length) {
//           currentNextIndex++
//           nextRef = inputRefs.current[currentNextIndex]
//         }

//         if (nextRef) {
//           nextRef.focus()
//         } else {
//           submitButtonRef.current?.focus()
//         }
//       } else {
//         submitButtonRef.current?.focus()
//       }
//     }
//   }

//   const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//   const validatePhone = phone => phone.replace(/\D/g, '').length === 10
//   const validatePincode = pincode => pincode.length === 6

//   const getErrorMessage = (field, value) => {
//     if (field === 'email' && value && !validateEmail(value)) return 'Invalid email'
//     if (field === 'mobile' && value && !validatePhone(value)) return 'Mobile must be 10 digits'
//     if (field === 'pincode' && value && !validatePincode(value)) return 'Pincode must be 6 digits'

//     return ''
//   }

//   const handleChange = (field, value) => setData(prev => ({ ...prev, [field]: value }))

//   const handleBlur = field => setTouched(prev => ({ ...prev, [field]: true }))

//   const loadFromIndexedDB = async id => {
//     try {
//       const db = await getCompanyDB()
//       const existing = await db.get('companies', id)

//       if (existing) {
//         setData(existing)
//         setEditCompanyId(existing.id)
//       }
//     } catch (err) {
//       console.error('Error loading from IndexedDB:', err)
//     }
//   }

//   const fetchCompanyData = async () => {
//     try {
//       setLoading(true)
//       const data = await getCompanyData()

//       if (Object.keys(data).length) {
//         setData(prev => ({
//           ...prev,
//           name: data.name || '',
//           company_code: data.company_code || '',
//           email: data.email || '',
//           gst: data.gst || '',
//           cin: data.cin || '',
//           statecode: data.statecode || '',
//           address_line_1: data.address_line_1 || '',
//           address_line_2: data.address_line_2 || '',
//           city: data.city || '',
//           state: data.state || '',
//           pincode: data.pincode || '',
//           phone: data.phone || '',
//           mobile: data.mobile || '',
//           fax: data.fax || '',

//           // Logo fields are populated with URL strings from API
//           logo: data.logo || '',
//           logo_small: data.logo_small || '',
//           logo_invoice: data.logo_invoice || ''
//         }))
//         setEditCompanyId(data.id)
//       } else {
//         loadFromIndexedDB(1)
//       }
//     } catch (err) {
//       if (err.response?.status === 401) {
//         toast.error('Session expired. Please login again.')
//         router.push('/login')

//         return
//       }

//       console.error('API fetch failed:', err)
//       toast.error('Failed to fetch company data.')
//       loadFromIndexedDB(1)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchCompanyData()
//   }, [])

//   const handleReset = () => {
//     setTouched({})
//     fetchCompanyData()
//   }

//   const handleSubmit = async () => {
//     try {
//       setLoading(true)
//       const db = await getCompanyDB()
//       const formData = new FormData()
//       const companyId = editCompanyId || 1

//       Object.entries(data).forEach(([key, value]) => {
//         if (key === 'id') return

//         // 1. If it's a NEW file (user selected a file)
//         if (value instanceof File) {
//           formData.append(key, value)
//         }

//         // 2. If it's a logo field BUT the value is NOT a File (it's the existing URL string)
//         else if (key === 'logo' || key === 'logo_small' || key === 'logo_invoice') {
//           // FIX: Skip appending the existing URL string.
//           // The backend MUST be configured to retain the existing value if the field is omitted.
//           return
//         }

//         // 3. Append all other non-file string data
//         else {
//           formData.append(key, value ?? '')
//         }
//       })

//       const updatedData = await updateCompanyData(companyId, formData)

//       // Update the state with the new data/paths returned from the server
//       setData(prev => ({ ...prev, ...updatedData }))
//       await db.put('companies', { ...data, ...updatedData, id: companyId })

//       toast.success('Company updated successfully!')
//     } catch (err) {
//       console.error('Error updating company:', err)
//       const errorMessage = err.response?.data?.message || err.message || 'Error updating company.'

//       toast.error(errorMessage)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Helper function to display the file name/status
//   const getFileDisplay = fileValue => {
//     if (fileValue instanceof File) {
//       return fileValue.name // New file selected
//     }

//     if (fileValue && typeof fileValue === 'string') {
//       // Show file name if URL contains it, or just "File Uploaded"
//       const parts = fileValue.split('/')

//       return parts.length > 1 ? parts.pop() : 'File Uploaded'
//     }

//     return 'Click to Upload' // No file
//   }

//   return (
//     <Card sx={{ p: '1.5rem' }}>
//       {/* Header and Breadcrumbs (unchanged) */}
//       <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
//           <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Company</span>
//         </div>

//         <div
//           style={{
//             fontSize: 14,
//             color: theme.palette.text.primary,
//             display: 'flex',
//             alignItems: 'center',
//             gap: 6
//           }}
//         >
//           <Link href='/' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
//             <Box display='flex' alignItems='center' gap={1}>
//               <i className='tabler-smart-home' style={{ fontSize: 20 }} />
//             </Box>
//           </Link>
//           {' / '}
//           <Link href='/masters' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
//             Masters
//           </Link>
//           {' / '}
//           <Link href='/company' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
//             Company
//           </Link>
//         </div>
//       </div>

//       {/* --- */}

//       <div>
//         <CardContent sx={{ padding: 0, mt: 5 }}>
//           <form onSubmit={e => e.preventDefault()}>
//             <Grid container spacing={6}>
//               {/* Company Name (Required) - Index 0 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label='Name'
//                   value={data.name}
//                   InputProps={{ readOnly: true }} // ✅ replaced disabled with readOnly
//                   onChange={e => handleChange('name', e.target.value)}
//                   onBlur={() => handleBlur('name')}
//                   error={touched.name && getErrorMessage('name', data.name) !== ''}
//                   helperText={touched.name && getErrorMessage('name', data.name)}
//                   inputRef={el => (inputRefs.current[getRefIndex('name')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('name'))}
//                 />
//               </Grid>

//               {/* Company Code (Required) - Index 1 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label={<>Company Code</>}
//                   value={data.company_code}
//                   onChange={e => handleChange('company_code', e.target.value)}
//                   onBlur={() => handleBlur('company_code')}
//                   error={touched.company_code && getErrorMessage('company_code', data.company_code) !== ''}
//                   helperText={touched.company_code && getErrorMessage('company_code', data.company_code)}
//                   inputRef={el => (inputRefs.current[getRefIndex('company_code')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('company_code'))}
//                 />
//               </Grid>

//               {/* Email (Required & Valid Email) - Index 2 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label={<>Email</>}
//                   value={data.email}
//                   onChange={e => handleChange('email', e.target.value)}
//                   onBlur={() => handleBlur('email')}
//                   error={touched.email && getErrorMessage('email', data.email) !== ''}
//                   helperText={touched.email && getErrorMessage('email', data.email)}
//                   inputRef={el => (inputRefs.current[getRefIndex('email')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('email'))}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label={<>GSTIN</>}
//                   value={data.gst}
//                   onChange={e => handleChange('gst', e.target.value)}
//                   onBlur={() => handleBlur('gst')}
//                   error={touched.gst && getErrorMessage('gst', data.gst) !== ''}
//                   helperText={touched.gst && getErrorMessage('gst', data.gst)}
//                   inputRef={el => (inputRefs.current[getRefIndex('gst')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('gst'))}
//                 />
//               </Grid>

//               {/* CIN (Optional) - Index 4 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label='CIN'
//                   value={data.cin}
//                   onChange={e => handleChange('cin', e.target.value)}
//                   inputRef={el => (inputRefs.current[getRefIndex('cin')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('cin'))}
//                 />
//               </Grid>

//               {/* State Code (Optional) - Index 5 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label='State Code'
//                   value={data.statecode}
//                   onChange={e => handleChange('statecode', e.target.value)}
//                   inputRef={el => (inputRefs.current[getRefIndex('statecode')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('statecode'))}
//                 />
//               </Grid>

//               {/* Address Line 1 (Required) - Index 6 (Multiline) */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label={<>Address Line 1</>}
//                   multiline
//                   type='textarea'
//                   rows={3}
//                   value={data.address_line_1}
//                   onChange={e => handleChange('address_line_1', e.target.value)}
//                   onBlur={() => handleBlur('address_line_1')}
//                   error={touched.address_line_1 && getErrorMessage('address_line_1', data.address_line_1) !== ''}
//                   helperText={touched.address_line_1 && getErrorMessage('address_line_1', data.address_line_1)}
//                   inputRef={el => (inputRefs.current[getRefIndex('address_line_1')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('address_line_1'))}
//                 />
//               </Grid>

//               {/* Address Line 2 (Optional) - Index 7 (Multiline) */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label=' Address Line 2'
//                   multiline
//                   rows={3}
//                   type='textarea'
//                   value={data.address_line_2}
//                   onChange={e => handleChange('address_line_2', e.target.value)}
//                   inputRef={el => (inputRefs.current[getRefIndex('address_line_2')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('address_line_2'))}
//                 />
//               </Grid>

//               {/* City (Required) - Index 8 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label={<>City</>}
//                   value={data.city}
//                   onChange={e => handleChange('city', e.target.value)}
//                   onBlur={() => handleBlur('city')}
//                   error={touched.city && getErrorMessage('city', data.city) !== ''}
//                   helperText={touched.city && getErrorMessage('city', data.city)}
//                   inputRef={el => (inputRefs.current[getRefIndex('city')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('city'))}
//                 />
//               </Grid>

//               {/* State (Required) - Index 9 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label={<>State</>}
//                   value={data.state}
//                   onChange={e => handleChange('state', e.target.value)}
//                   onBlur={() => handleBlur('state')}
//                   error={touched.state && getErrorMessage('state', data.state) !== ''}
//                   helperText={touched.state && getErrorMessage('state', data.state)}
//                   inputRef={el => (inputRefs.current[getRefIndex('state')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('state'))}
//                 />
//               </Grid>

//               {/* Pin Code (Optional, 6 digits validation) - Index 10 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label='Pin Code'
//                   value={data.pincode}
//                   onChange={e => handleChange('pincode', e.target.value)}
//                   onBlur={() => handleBlur('pincode')}
//                   error={touched.pincode && getErrorMessage('pincode', data.pincode) !== ''}
//                   helperText={touched.pincode && getErrorMessage('pincode', data.pincode)}
//                   inputRef={el => (inputRefs.current[getRefIndex('pincode')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('pincode'))}
//                 />
//               </Grid>

//               {/* Phone (Optional, 3 + 7 digits formatting) - Index 11 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label='Phone'
//                   value={data.phone}
//                   onChange={e => handleChange('phone', e.target.value)}
//                   onBlur={() => handleBlur('phone')}
//                   error={touched.phone && getErrorMessage('phone', data.phone) !== ''}
//                   helperText={touched.phone && getErrorMessage('phone', data.phone)}
//                   inputRef={el => (inputRefs.current[getRefIndex('phone')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('phone'))}
//                 />
//               </Grid>

//               {/* Mobile (Required & 5 + 5 digits formatting) - Index 12 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label={<>Mobile</>}
//                   value={data.mobile}
//                   onChange={e => handleChange('mobile', e.target.value)}
//                   onBlur={() => handleBlur('mobile')}
//                   error={touched.mobile && getErrorMessage('mobile', data.mobile) !== ''}
//                   helperText={touched.mobile && getErrorMessage('mobile', data.mobile)}
//                   inputRef={el => (inputRefs.current[getRefIndex('mobile')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('mobile'))}
//                 />
//               </Grid>

//               {/* Fax (Required) - Index 13 */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <CustomTextField
//                   fullWidth
//                   label={<>Fax</>}
//                   value={data.fax}
//                   onChange={e => handleChange('fax', e.target.value)}
//                   onBlur={() => handleBlur('fax')}
//                   error={touched.fax && getErrorMessage('fax', data.fax) !== ''}
//                   helperText={touched.fax && getErrorMessage('fax', data.fax)}
//                   inputRef={el => (inputRefs.current[getRefIndex('fax')] = el)}
//                   onKeyDown={e => handleKeyDown(e, getRefIndex('fax'))}
//                 />
//               </Grid>

//               {/* Logo Upload (Index 14) */}

//               {/* <Grid size={{ xs: 12, sm: 4 }}>
//                 <Box sx={{ width: '100%' }}>
//                   <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
//                     Logo
//                   </Typography>

//                   <input
//                   src='data.logo'
//                     type='file'
//                     style={{ display: 'none' }}
//                     ref={logoInputRef}
//                     onChange={e => {
//                       const file = e.target.files?.[0] || ''

//                       setData(prev => ({ ...prev, logo: file }))
//                     }}

//                   />

//                   <Button
//                     variant='outlined'
//                     fullWidth
//                     onClick={() => logoInputRef.current?.click()}
//                     sx={{
//                       justifyContent: 'center',
//                       borderStyle: 'solid',
//                       borderWidth: 1,
//                       padding: 1.5,
//                       textTransform: 'none'
//                     }}
//                   >
//                     {getFileDisplay(data.logo)}
//                   </Button>
//                 </Box>
//               </Grid> */}

//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <Box sx={{ width: '100%' }}>
//                   <label
//                     htmlFor='logo-upload'
//                     style={{
//                       display: 'block',
//                       marginBottom: '1px',

//                       fontWeight: 200,
//                       fontSize: '0.8rem',
//                       color: '#111'
//                     }}
//                   >
//                     Logo
//                   </label>

//                   <input
//                     type='file'
//                     accept='image/*'
//                     style={{ display: 'none' }}
//                     ref={logoInputRef}
//                     onChange={e => {
//                       const file = e.target.files?.[0]

//                       if (file) {
//                         setData(prev => ({
//                           ...prev,
//                           logo: file,
//                           logoPreview: URL.createObjectURL(file)
//                         }))
//                       }
//                     }}
//                   />

//                   <Button
//                     variant='outlined'
//                     fullWidth
//                     onClick={() => logoInputRef.current?.click()}
//                     sx={{
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       borderStyle: 'solid',
//                       borderWidth: 1,
//                       padding: 1.5,
//                       height: 38,
//                       textTransform: 'none',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       overflow: 'hidden',
//                       position: 'relative'
//                     }}
//                   >
//                     {data.logo ? (
//                       <img
//                         src={data.logo}
//                         alt='Logo Preview'
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'contain',
//                           borderRadius: 6
//                         }}
//                       />
//                     ) : (
//                       <Typography variant='body2' color='text.secondary'>
//                         {getFileDisplay(data.logo)}
//                       </Typography>
//                     )}
//                   </Button>
//                 </Box>
//               </Grid>

//               {/* Logo Small Upload (Index 15) */}
//               {/* <Grid size={{ xs: 12, sm: 4 }}>
//                 <Box sx={{ width: '100%' }}>
//                   <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
//                     Small Logo
//                   </Typography>

//                   <input
//                     type='file'
//                     style={{ display: 'none' }}
//                     ref={logoSmallInputRef}
//                     onChange={e => {
//                       const file = e.target.files?.[0] || ''

//                       setData(prev => ({ ...prev, logo_small: file }))
//                     }}
//                   />

//                   <Button
//                     variant='outlined'
//                     fullWidth
//                     onClick={() => logoSmallInputRef.current?.click()}
//                     sx={{
//                       justifyContent: 'center',
//                       borderStyle: 'solid',
//                       borderWidth: 1,
//                       padding: 1.5,
//                       textTransform: 'none'
//                     }}
//                   >
//                     {getFileDisplay(data.logo_small)}
//                   </Button>
//                 </Box>
//               </Grid> */}

//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <Box sx={{ width: '100%' }}>
//                   <label
//                     htmlFor='logo-upload'
//                     style={{
//                       display: 'block',
//                       marginBottom: '1px',

//                       fontWeight: 200,
//                       fontSize: '0.8rem',
//                       color: '#111'
//                     }}
//                   >
//                     Small Logo
//                   </label>

//                   <input
//                     type='file'
//                     accept='image/*'
//                     style={{ display: 'none' }}
//                     ref={logoSmallInputRef}
//                     onChange={e => {
//                       const file = e.target.files?.[0]

//                       if (file) {
//                         setData(prev => ({
//                           ...prev,
//                           logo_small: file,
//                           logoPreview: URL.createObjectURL(file)
//                         }))
//                       }
//                     }}
//                   />

//                   <Button
//                     variant='outlined'
//                     fullWidth
//                     onClick={() => logoSmallInputRef.current?.click()}
//                     sx={{
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       borderStyle: 'solid',
//                       borderWidth: 1,
//                       padding: 1.5,
//                       height: 40,
//                       textTransform: 'none',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       overflow: 'hidden',
//                       position: 'relative'
//                     }}
//                   >
//                     {data.logo_small ? (
//                       <img
//                         src={data.logo_small}
//                         alt='Logo Preview'
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'contain',
//                           borderRadius: 6
//                         }}
//                       />
//                     ) : (
//                       <Typography variant='body2' color='text.secondary'>
//                         {getFileDisplay(data.logo_small)}
//                       </Typography>
//                     )}
//                   </Button>
//                 </Box>
//               </Grid>

//               {/* Logo Invoice Upload (Index 16) */}
//               {/* <Grid size={{ xs: 12, sm: 4 }}>
//                 <Box sx={{ width: '100%' }}>
//                   <Typography variant='body2' sx={{ mb: 1, fontWeight: 500 }}>
//                     Logo Invoice
//                   </Typography>

//                   <input
//                     type='file'
//                     style={{ display: 'none' }}
//                     ref={logoInvoiceInputRef}
//                     onChange={e => {
//                       const file = e.target.files?.[0] || ''

//                       setData(prev => ({ ...prev, logo_invoice: file }))
//                     }}
//                   />

//                   <Button
//                     variant='outlined'
//                     fullWidth
//                     onClick={() => logoInvoiceInputRef.current?.click()}
//                     sx={{
//                       justifyContent: 'center',
//                       borderStyle: 'solid',
//                       borderWidth: 1,
//                       padding: 1.5,
//                       textTransform: 'none'
//                     }}
//                   >
//                     {getFileDisplay(data.logo_invoice)}
//                   </Button>
//                 </Box>
//               </Grid> */}

//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <Box sx={{ width: '100%' }}>
//                   <label
//                     htmlFor='logo-upload'
//                     style={{
//                       display: 'block',
//                       marginBottom: '1px',

//                       fontWeight: 200,
//                       fontSize: '0.8rem',
//                       color: '#111'
//                     }}
//                   >
//                     Logo Invoice
//                   </label>

//                   <input
//                     type='file'
//                     accept='image/*'
//                     style={{ display: 'none' }}
//                     ref={logoInvoiceInputRef}
//                     onChange={e => {
//                       const file = e.target.files?.[0]

//                       if (file) {
//                         setData(prev => ({
//                           ...prev,
//                           logo_invoice: file,
//                           logoPreview: URL.createObjectURL(file)
//                         }))
//                       }
//                     }}
//                   />

//                   <Button
//                     variant='outlined'
//                     fullWidth
//                     onClick={() => logoInvoiceInputRef.current?.click()}
//                     sx={{
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       borderStyle: 'solid',
//                       borderWidth: 1,
//                       padding: 1.5,
//                       height: 40,
//                       textTransform: 'none',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       overflow: 'hidden',
//                       position: 'relative'
//                     }}
//                   >
//                     {data.logo_invoice ? (
//                       <img
//                         src={data.logo_invoice}
//                         alt='Logo Preview'
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'contain',
//                           borderRadius: 6
//                         }}
//                       />
//                     ) : (
//                       <Typography variant='body2' color='text.secondary'>
//                         {getFileDisplay(data.logo_invoice)}
//                       </Typography>
//                     )}
//                   </Button>
//                 </Box>
//               </Grid>
//             </Grid>

//             {/* Buttons */}
//             <Grid container spacing={2} justifyContent='flex-end' sx={{ mt: 4 }}>
//               <Grid>
//                 <Button
//                   variant='outlined'
//                   sx={{
//                     borderColor: theme.palette.text.primary,
//                     color: theme.palette.text.primary,
//                     textTransform: 'none',
//                     '&:hover': {
//                       borderColor: theme.palette.text.primary,
//                       backgroundColor: 'rgba(33, 44, 98, 0.08)'
//                     }
//                   }}
//                   onClick={handleReset}
//                 >
//                   Back
//                 </Button>
//               </Grid>
//               <Grid>
//                 <Button
//                   type='submit'
//                   variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
//                   sx={{
//                     textTransform: 'none',

//                     backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
//                     color:
//                       theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
//                     borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
//                     '&:hover': {
//                       backgroundColor:
//                         theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(33, 44, 98, 0.08)',
//                       borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
//                     }
//                   }}
//                   onClick={handleSubmit}
//                   ref={submitButtonRef}
//                   disabled={loading}
//                 >
//                   {loading ? 'Updating...' : 'Update'}
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </CardContent>
//       </div>
//     </Card>
//   )
// }

// export default Company
