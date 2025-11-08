'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { styled, useTheme } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'

// Custom Imports
import DialogCloseButton from './closebtn'
import CustomTextField from '@core/components/mui/TextField'

// API Services
import {
  getCategories,
  getSubCategories,
  getVehicleMake,
  getVehicleType,
  getBodyType,
  getEngineType,
  getFuel,
  getGearBox
} from '@/services/vehicleModelApi'

// Style component to add the red asterisk for required fields
const LabelWithStar = styled('span')({
  '&::before': {
    content: '"*"',
    color: 'red',
    marginRight: 4
  }
})

const AddModelWindow = ({ open, setOpen, editingRow, onSaveCategory }) => {
  const theme = useTheme()

  const [data, setData] = useState({
    id: null,
    name: '',
    categoryId: '',
    subCategoryId: '',
    vehicleMakeId: '',
    vehicleTypeId: '',
    bodyTypeId: '',
    engineTypeId: '',
    fuelTypeId: '',
    gearboxId: '',
    transmission: '',
    seatingCapacity: '',
    power: '',
    noOfWheels: '',
    tankCapacity: '',
    remarks: ''
  })

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [vehicleMakes, setVehicleMakes] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])
  const [engineTypes, setEngineTypes] = useState([])
  const [fuelTypes, setFuelTypes] = useState([])
  const [gearBoxes, setGearBoxes] = useState([])
  const [loading, setLoading] = useState(false)

  // Load dropdowns
  useEffect(() => {
    if (open) {
      const fetchAll = async () => {
        setLoading(true)

        try {
          const [cat, subCat, make, vType, body, engine, fuel, gear] = await Promise.all([
            getCategories(),
            getSubCategories(),
            getVehicleMake(),
            getVehicleType(),
            getBodyType(),
            getEngineType(),
            getFuel(),
            getGearBox()
          ])

          setCategories(cat)
          setSubCategories(subCat)
          setVehicleMakes(make)
          setVehicleTypes(vType)
          setBodyTypes(body)
          setEngineTypes(engine)
          setFuelTypes(fuel)
          setGearBoxes(gear)
        } catch (err) {
          console.error('Error loading dropdowns:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchAll()
    }
  }, [open])

  // Load edit data
  useEffect(() => {
    if (editingRow) {
      setData({
        id: editingRow.id,
        name: editingRow.name || '',
        categoryId: editingRow.categoryId || '',
        subCategoryId: editingRow.subCategoryId || '',
        vehicleMakeId: editingRow.vehicleMakeId || '',
        vehicleTypeId: editingRow.vehicleTypeId || '',
        bodyTypeId: editingRow.bodyTypeId || '',
        engineTypeId: editingRow.engineTypeId || '',
        fuelTypeId: editingRow.fuelTypeId || '',
        gearboxId: editingRow.gearboxId || '',
        transmission: editingRow.transmission || '',
        seatingCapacity: editingRow.seating_capacity || '',
        power: editingRow.power || '',
        noOfWheels: editingRow.no_of_weels || '',
        tankCapacity: editingRow.tank || '',
        remarks: editingRow.remarks || ''
      })
    } else {
      setData({
        id: null,
        name: '',
        categoryId: '',
        subCategoryId: '',
        vehicleMakeId: '',
        vehicleTypeId: '',
        bodyTypeId: '',
        engineTypeId: '',
        fuelTypeId: '',
        gearboxId: '',
        transmission: '',
        seatingCapacity: '',
        power: '',
        noOfWheels: '',
        tankCapacity: '',
        remarks: ''
      })
    }
  }, [editingRow, open])

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleClose = () => setOpen(false)

  const handleSave = () => {
    if (!data.name) {
      alert('Name is required')

      return
    }

    if (typeof onSaveCategory === 'function') {
      onSaveCategory(data, data.id)
      handleClose()
    } else {
      console.error('onSaveCategory prop is missing or not a function!')
    }
  }

  const modalTitle = editingRow ? 'Edit Vehicle Model' : 'Add Vehicle Model'
  const actionButtonText = editingRow ? 'Update' : 'Add'

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
          {/* Vehicle Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label={<LabelWithStar>Name</LabelWithStar>}
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              loading={loading}
              options={categories}
              getOptionLabel={option => option.name || ''}
              value={categories.find(opt => opt.id === data.categoryId) || null}
              onChange={(e, newValue) => handleChange('categoryId', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Category</LabelWithStar>} />}
            />
          </Grid>

          {/* SubCategory */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              loading={loading}
              options={subCategories}
              getOptionLabel={option => option.name || ''}
              value={subCategories.find(opt => opt.id === data.subCategoryId) || null}
              onChange={(e, newValue) => handleChange('subCategoryId', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>SubCategory</LabelWithStar>} />}
            />
          </Grid>

          {/* Vehicle Make */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleMakes}
              getOptionLabel={option => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {' '}
                  {/* ✅ unique key */}
                  {option.name}
                </li>
              )}
              value={vehicleMakes.find(opt => opt.id === data.vehicleMakeId) || null}
              onChange={(e, newValue) => handleChange('vehicleMakeId', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label='Vehicle Make' />}
            />
          </Grid>

          {/* Vehicle Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleTypes}
              getOptionLabel={option => option.name || ''}
              value={vehicleTypes.find(opt => opt.id === data.vehicleTypeId) || null}
              onChange={(e, newValue) => handleChange('vehicleTypeId', newValue ? newValue.id : '')}
              renderInput={params => (
                <CustomTextField {...params} label={<LabelWithStar>Vehicle Type</LabelWithStar>} />
              )}
            />
          </Grid>

          {/* Body Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={bodyTypes}
              getOptionLabel={option => option.name || ''}
              value={bodyTypes.find(opt => opt.id === data.bodyTypeId) || null}
              onChange={(e, newValue) => handleChange('bodyTypeId', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Body Type</LabelWithStar>} />}
            />
          </Grid>

          {/* Engine Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={engineTypes}
              getOptionLabel={option => option.name || ''}
              value={engineTypes.find(opt => opt.id === data.engineTypeId) || null}
              onChange={(e, newValue) => handleChange('engineTypeId', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Engine Type</LabelWithStar>} />}
            />
          </Grid>

          {/* Fuel Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={fuelTypes}
              getOptionLabel={option => option.name || ''}
              value={fuelTypes.find(opt => opt.id === data.fuelTypeId) || null}
              onChange={(e, newValue) => handleChange('fuelTypeId', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Fuel Type</LabelWithStar>} />}
            />
          </Grid>

          {/* Gearbox Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={gearBoxes}
              getOptionLabel={option => option.name || ''}
              value={gearBoxes.find(opt => opt.id === data.gearboxId) || null}
              onChange={(e, newValue) => handleChange('gearboxId', newValue ? newValue.id : '')}
              renderInput={params => (
                <CustomTextField {...params} label={<LabelWithStar>Gearbox Type</LabelWithStar>} />
              )}
            />
          </Grid>

          {/* Transmission */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Transmission'
              fullWidth
              value={data.transmission}
              onChange={e => handleChange('transmission', e.target.value)}
            />
          </Grid>

          {/* Seating Capacity */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Seating Capacity'
              fullWidth
              value={data.seating_capacity}
              onChange={e => handleChange('seating_capacity', e.target.value)}
            />
          </Grid>

          {/* Power */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Power'
              fullWidth
              value={data.power}
              onChange={e => handleChange('power', e.target.value)}
            />
          </Grid>

          {/* No of Wheels */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='No of Wheels'
              fullWidth
              value={data.no_of_weels}
              onChange={e => handleChange('no_of_weels', e.target.value)}
            />
          </Grid>

          {/* Tank Capacity */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label='Tank Capacity'
              fullWidth
              value={data.tankCapacity}
              onChange={e => handleChange('tankCapacity', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }}>
            <CustomTextField
              label='Remarks'
              fullWidth
              value={data.remarks}
              onChange={e => handleChange('remarks', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          onClick={handleClose}
          variant='outlined'
          sx={{
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            textTransform: 'none'
          }}
        >
          Close
        </Button>

        <Button onClick={handleSave} variant='contained' sx={{ textTransform: 'none' }}>
          {actionButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddModelWindow
