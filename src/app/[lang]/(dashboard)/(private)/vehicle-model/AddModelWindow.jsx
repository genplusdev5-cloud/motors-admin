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

import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'

import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderSingle from './FileUploaderSingle'

const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModalWindow = ({ open, setOpen, initialData, onSave }) => {
  const theme = useTheme()

  const [data, setData] = useState({
    id: null,
    vehicleType: '',
    name: '',

    transmission: '',

    seatingCapacity: '',

  })

  const vehicleOptions = [
    { label: 'Two Wheeler', value: 'two' },
    { label: 'Four Wheeler', value: 'four' }
  ]

  useEffect(() => {
    if (open) {
      if (initialData) {
        setData({
          ...initialData,
          manufacturingYear: initialData.manufacturingYear || '',
          regYear: initialData.regYear || ''
        })
      } else {
        setData({
          id: '',
          vehicleType: '',
          name: '',

          transmission: '',

          seatingCapacity: '',

        })
      }
    }
  }, [open, initialData])

// CATEGORY LIST-------------------------------------------------------

  const fetchCategoryList = async () => {
    setLoading(true)

    try {
      const token ={ACCESS_TOKEN}


      const res = await fetch('http://motor-match.genplusinnovations.com:7023/api/category-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token')
        setCategories([])

        return
      }

      const result = await res.json()

      // ✅ Adjusted for your actual API response structure
      if (Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        console.error('Unexpected API structure:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }



  // SUBCATEGORY LIST--------------------------------------------------------------

    const fetchSubCategoryList = async () => {
    setLoading(true)

    try {
      const token ={ACCESS_TOKEN}


      const res = await fetch('http://motor-match.genplusinnovations.com:7023/api/subcategory-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token')
        setCategories([])

        return
      }

      const result = await res.json()

      // ✅ Adjusted for your actual API response structure
      if (Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        console.error('Unexpected API structure:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }



  // VEHICLE MAKE LIST-----------------------------------------

    const fetchVehicleMakeList = async () => {
    setLoading(true)

    try {
      const token ={ACCESS_TOKEN}


      const res = await fetch('http://motor-match.genplusinnovations.com:7023/api/make-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token')
        setCategories([])

        return
      }

      const result = await res.json()

      // ✅ Adjusted for your actual API response structure
      if (Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        console.error('Unexpected API structure:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }


  // VEHICLE TYPE LIST--------------------------------------

    const fetchVehicleTypeList = async () => {
    setLoading(true)

    try {
      const token ={ACCESS_TOKEN}


      const res = await fetch('http://motor-match.genplusinnovations.com:7023/api/vehicle-type-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token')
        setCategories([])

        return
      }

      const result = await res.json()

      // ✅ Adjusted for your actual API response structure
      if (Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        console.error('Unexpected API structure:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // BODY TYPE LIST----------------------------------------

    const fetchBodyTypeList = async () => {
    setLoading(true)

    try {
      const token ={ACCESS_TOKEN}


      const res = await fetch('http://motor-match.genplusinnovations.com:7023/api/body-type-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token')
        setCategories([])

        return
      }

      const result = await res.json()

      // ✅ Adjusted for your actual API response structure
      if (Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        console.error('Unexpected API structure:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }


  // engine type LIST---------------------------------------------------------

    const fetchEngineTypeList = async () => {
    setLoading(true)

    try {
      const token ={ACCESS_TOKEN}


      const res = await fetch('http://motor-match.genplusinnovations.com:7023/api/engine-type-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token')
        setCategories([])

        return
      }

      const result = await res.json()

      // ✅ Adjusted for your actual API response structure
      if (Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        console.error('Unexpected API structure:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }


  // FUEL TYPE LIST----------------------------------------------------------

    const fetchFuelTypeList = async () => {
    setLoading(true)

    try {
      const token ={ACCESS_TOKEN}


      const res = await fetch('http://motor-match.genplusinnovations.com:7023/api/fuel-type-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token')
        setCategories([])

        return
      }

      const result = await res.json()

      // ✅ Adjusted for your actual API response structure
      if (Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        console.error('Unexpected API structure:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }


  // GEARBOX TYPE LIST


    const fetchGearboxType = async () => {
    setLoading(true)

    try {
      const token ={ACCESS_TOKEN}


      const res = await fetch('http://motor-match.genplusinnovations.com:7023/api/gearbox-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })

      if (res.status === 401) {
        console.error('Unauthorized: Invalid or expired token')
        setCategories([])

        return
      }

      const result = await res.json()

      // ✅ Adjusted for your actual API response structure
      if (Array.isArray(result.data)) {
        setCategories(result.data)
      } else {
        console.error('Unexpected API structure:', result)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }















  const handleClose = () => setOpen(false)

  const handleChange = (field, value) => {
    if (field === 'manufacturingYear' || field === 'regYear') {
      // Only allow numbers, max 4 digits
      const cleaned = value.replace(/\D/g, '').slice(0, 4)

      setData(prev => ({ ...prev, [field]: cleaned }))
    } else {
      setData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleChanges = event => {
    setData(prev => ({
      ...prev,
      vehicleType: event.target.value
    }))
  }



  const handleSave = () => {
    if (!data.vehicleType || !data.name) {
      alert('Vehicle Type and Name are required.')

      return
    }

    const yearPattern = /^\d{4}$/

    if (
      (data.manufacturingYear && !yearPattern.test(data.manufacturingYear)) ||
      (data.regYear && !yearPattern.test(data.regYear))
    ) {
      alert('Manufacturing Year and Registration Year must be 4 digits.')

      return
    }

    onSave(data)
  }

  const customThemeColor = '#212c62'
  const modalTitle = initialData ? 'Edit Vehicle Model' : 'Add Vehicle Model'
  const actionButtonText = initialData ? 'Save Changes' : 'Add'

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      sx={{
        '& .MuiDialog-container': { alignItems: 'flex-start' },
        '& .MuiDialog-paper': { overflow: 'visible', width: 800, maxWidth: '100%' }
      }}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>{modalTitle}</DialogTitle>

      <Divider sx={{ mx: -3, my: 2 }} />

      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={5}>
{/*
         <Grid size={{ xs: 12, sm: 6 }}>
      <Autocomplete
        multiple
        fullWidth
        options={vehicleOptions}
        getOptionLabel={option => option.label}
        value={vehicleOptions.filter(opt => selectedVehicles.some(v => v.value === opt.value))}
        onChange={handleVehicleChange}

        renderInput={params => (
          <CustomTextField
            {...params}
            label={<LabelWithStar>Category</LabelWithStar>}
            placeholder='Select vehicle types'
          />
        )}
      />
    </Grid> */}





          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleOptions}
              getOptionLabel={option => option.label}
              value={vehicleOptions.find(opt => opt.value === data.vehicleType) || null}
              onChange={(event, newValue) => {
                handleChange('vehicleType', newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<LabelWithStar>Category</LabelWithStar>}
                  onChange={e => handleChange('vehicleType', e.target.value)} // capture typed text
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleOptions}
              getOptionLabel={option => option.label}
              value={vehicleOptions.find(opt => opt.value === data.vehicleType) || null}
              onChange={(event, newValue) => {
                handleChange('vehicleType', newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<LabelWithStar>SubCategory</LabelWithStar>}
                  onChange={e => handleChange('vehicleType', e.target.value)} // capture typed text
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleOptions}
              getOptionLabel={option => option.label}
              value={vehicleOptions.find(opt => opt.value === data.vehicleType) || null}
              onChange={(event, newValue) => {
                handleChange('vehicleType', newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<LabelWithStar>Vehicle Make</LabelWithStar>}
                  onChange={e => handleChange('vehicleType', e.target.value)} // capture typed text
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleOptions}
              getOptionLabel={option => option.label}
              value={vehicleOptions.find(opt => opt.value === data.vehicleType) || null}
              onChange={(event, newValue) => {
                handleChange('vehicleType', newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<LabelWithStar>Vehicle Type</LabelWithStar>}
                  onChange={e => handleChange('vehicleType', e.target.value)} // capture typed text
                />
              )}
            />
          </Grid>



          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Power'
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleOptions}
              getOptionLabel={option => option.label}
              value={vehicleOptions.find(opt => opt.value === data.vehicleType) || null}
              onChange={(event, newValue) => {
                handleChange('vehicleType', newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<LabelWithStar>Body Type</LabelWithStar>}
                  onChange={e => handleChange('vehicleType', e.target.value)} // capture typed text
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleOptions}
              getOptionLabel={option => option.label}
              value={vehicleOptions.find(opt => opt.value === data.vehicleType) || null}
              onChange={(event, newValue) => {
                handleChange('vehicleType', newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<LabelWithStar>Engine Type</LabelWithStar>}
                  onChange={e => handleChange('vehicleType', e.target.value)} // capture typed text
                />
              )}
            />
          </Grid>

          

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleOptions}
              getOptionLabel={option => option.label}
              value={vehicleOptions.find(opt => opt.value === data.vehicleType) || null}
              onChange={(event, newValue) => {
                handleChange('vehicleType', newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<LabelWithStar>Fuel Type</LabelWithStar>}
                  onChange={e => handleChange('vehicleType', e.target.value)} // capture typed text
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleOptions}
              getOptionLabel={option => option.label}
              value={vehicleOptions.find(opt => opt.value === data.vehicleType) || null}
              onChange={(event, newValue) => {
                handleChange('vehicleType', newValue ? newValue.value : '')
              }}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<LabelWithStar>Gearbox Type</LabelWithStar>}
                  onChange={e => handleChange('vehicleType', e.target.value)} // capture typed text
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Transmission'
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Seating Capacity'
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='No of wheels'
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Tank Capacity'
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          {/* Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Name'
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          {/* <Grid item xs={12} sm={4}>
            <Typography
              variant='caption'
              component='label'
              sx={{ display: 'block', fontWeight: 400, color: 'text.primary' }}
            >
              <LabelWithStar /> Vehicle Image
            </Typography>

            <FileUploaderSingle onFileChange={files => handleFileChange('logo', files)} />
          </Grid> */}

          {/* Remarks */}
          {/* <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Remarks'
              fullWidth
              multiline
              rows={2}
              value={formData.remarks}
              onChange={e => handleChange('remarks', e.target.value)}
              sx={{ ml: 4 }}
            />
          </Grid> */}
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
