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
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { MenuItem, Chip } from '@mui/material'
import Box from '@mui/material/Box'

import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'

// Custom
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
  getColor,
  getMileage,
  getCylinder
} from '@/services/vehicleModelApi'

// Label with required star
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
    category_id: '',
    subcategory_id: '',
    make_id: '',
    make_name: '',
    vehicle_type_name: '',
    vehicle_type_id: '',
    body_type_id: '',
    engine_type_id: '',
    fuel_type_id: '',
    transmission: '',
    seating_capacity: '',
    power: '',
    no_of_weels: '',
    tank_capacity: '',
    remarks: '',
    color_id: '',
    mileage_id: '',
    cylinder_no: ''
  })

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [vehicleMakes, setVehicleMakes] = useState([])
  const [vehicleTypes, setVehicleTypes] = useState([])
  const [bodyTypes, setBodyTypes] = useState([])
  const [engineTypes, setEngineTypes] = useState([])
  const [fuelTypes, setFuelTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [colors, setColors] = useState([])
  const [mileages, setMileages] = useState([])
  const [cylinderNo, setCylinderNo] = useState([])

  // Load dropdown data
  useEffect(() => {
    if (open) {
      const fetchAll = async () => {
        setLoading(true)

        try {
          const [cat, subCat, make, vehicleTypes, body, engine, fuel, color, mileage, cylinder] = await Promise.all([
            getCategories(),
            getSubCategories(),
            getVehicleMake(),
            getVehicleType(),
            getBodyType(),
            getEngineType(),
            getFuel(),
            getColor(),
            getMileage(),
            getCylinder()
          ])

          setCategories(cat)
          setSubCategories(subCat)
          setVehicleMakes(make)
          setVehicleTypes(vehicleTypes)
          setBodyTypes(body)
          setEngineTypes(engine)
          setFuelTypes(fuel)
          setColors(color)
          setMileages(mileage)
          setCylinderNo(cylinder)
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
        id: editingRow.id || null,
        name: editingRow.name || '',
        category_id: editingRow.category_id || '',
        subcategory_id: editingRow.subcategory_id || '',
        make_id: editingRow.make_id || '',
        vehicle_type_id: editingRow.vehicle_type_id || '',
        body_type_id: editingRow.body_type_id || '',
        engine_type_id: editingRow.engine_type_id || '',
        fuel_type_id: editingRow.fuel_type_id || '',
        transmission: editingRow.transmission || '',
        seating_capacity: editingRow.seating_capacity || '',
        power: editingRow.power || '',
        no_of_weels: editingRow.no_of_weels || '',
        tank_capacity: editingRow.tank_capacity || '',
        remarks: editingRow.remarks || '',
        color_id: editingRow.color_id || '',
        mileage_id: editingRow.mileage || '',
        cylinder_no: editingRow.cylinder || ''
      })
    } else {
      setData(prev => ({ ...prev, id: null }))
    }
  }, [editingRow, open])

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleClose = () => setOpen(false)

  const handleSave = () => {
    if (!data.name) {
      toast('⚠️ Name is required.')

      return
    }

    if (typeof onSaveCategory === 'function') {
      onSaveCategory(data, data.id) // Parent handles API save and refresh
      handleClose()
    } else {
      console.error('onSaveCategory is not provided or not a function')
    }
  }

  const modalTitle = editingRow ? 'Edit Vehicle Model' : 'Add Vehicle Model'
  const actionButtonText = editingRow ? 'Update' : 'Add'

  const renderCylinderValue = selected => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
           {' '}
      {selected.map(value => {
        return <Chip key={value} size='small' label={value} />
      })}
         {' '}
    </Box>
  )

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
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              label={<LabelWithStar>Name</LabelWithStar>}
              fullWidth
              value={data.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={categories}
              getOptionLabel={option => option.name || ''}
              value={categories.find(cat => cat.id === data.category_id) || null}
              onChange={(event, newValue) => handleChange('category_id', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Category</LabelWithStar>} />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/* <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Category</LabelWithStar>}
              fullWidth
              value={data.category_id}
              onChange={e => handleChange('category_id', e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}

                </MenuItem>
              ))}
            </CustomTextField>
          </Grid> */}

          {/* ----------------------------------subcategory--------------------------------------- */}

          {/* <Grid size={{ xs: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Sub Category</LabelWithStar>}
              fullWidth
              value={data.subcategory_id}
              onChange={e => handleChange('subcategory_id', e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              {subCategories.map(subCategory => (
                <MenuItem key={subCategory.id} value={subCategory.id}>
                  {subCategory.subcategory_name || subCategory.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid> */}

          <Grid size={{ xs: 6 }}>
            <Autocomplete
              fullWidth
              options={subCategories}
              getOptionLabel={option => option.subcategory_name || option.name || ''}
              value={subCategories.find(sub => sub.id === data.subcategory_id) || null}
              onChange={(event, newValue) => handleChange('subcategory_id', newValue ? newValue.id : '')}
              renderInput={params => (
                <CustomTextField {...params} label={<LabelWithStar>Sub Category</LabelWithStar>} />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/* -------------------------------make------------------------------ */}

          {/* <Grid size={{ xs: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Make</LabelWithStar>}
              fullWidth
              value={data.make_id}
              onChange={e => handleChange('make_id', e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              {vehicleMakes.map(makeList => (
                <MenuItem key={makeList.id} value={makeList.id}>
                  {makeList.make_name || makeList.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid> */}

          <Grid size={{ xs: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleMakes}
              getOptionLabel={option => option.make_name || option.name || ''}
              value={vehicleMakes.find(make => make.id === data.make_id) || null}
              onChange={(event, newValue) => handleChange('make_id', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Make</LabelWithStar>} />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/* ----------------------------vehicle type------------------------------------------------------ */}

          {/* <Grid size={{ xs: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Vehicle Type</LabelWithStar>}
              fullWidth
              value={data.vehicle_type_id}
              onChange={e => handleChange('vehicle_type_id', parseInt(e.target.value, 10))}
              SelectProps={{ displayEmpty: true }}
            >
              {vehicleTypes.map(vehicle => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicle_type_name || vehicle.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid> */}

          <Grid size={{ xs: 6 }}>
            <Autocomplete
              fullWidth
              options={vehicleTypes}
              getOptionLabel={option => option.vehicle_type_name || option.name || ''}
              value={vehicleTypes.find(v => v.id === data.vehicle_type_id) || null}
              onChange={(event, newValue) => handleChange('vehicle_type_id', newValue ? parseInt(newValue.id, 10) : '')}
              renderInput={params => (
                <CustomTextField {...params} label={<LabelWithStar>Vehicle Type</LabelWithStar>} />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/*------------------------engine type------------------------------------------------------------------------  */}

          {/* <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Engine Type</LabelWithStar>}
              fullWidth
              value={data.enginee_type_id}
              onChange={e => handleChange('enginee_type_id', parseInt(e.target.value, 10))}
              SelectProps={{ displayEmpty: true }}
            >
              {engineTypes.map(engine => (
                <MenuItem key={engine.id} value={engine.id}>
                  {engine.engine_name || engine.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid> */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={engineTypes}
              getOptionLabel={option => option.engine_name || option.name || ''}
              value={engineTypes.find(engine => engine.id === data.enginee_type_id) || null}
              onChange={(event, newValue) => handleChange('enginee_type_id', newValue ? parseInt(newValue.id, 10) : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Engine Type</LabelWithStar>} />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/* -------------------------------Body Type ------------------------------------------------------------------*/}
          {/* <Grid size={{ xs: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Body Type</LabelWithStar>}
              fullWidth
              value={data.body_type_id}
              onChange={e => handleChange('body_type_id', e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              {bodyTypes.map(body => (
                <MenuItem key={body.id} value={body.id}>
                  {body.body_type_name || body.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid> */}

          <Grid size={{ xs: 6 }}>
            <Autocomplete
              fullWidth
              options={bodyTypes}
              getOptionLabel={option => option.body_type_name || option.name || ''}
              value={bodyTypes.find(body => body.id === data.body_type_id) || null}
              onChange={(event, newValue) => handleChange('body_type_id', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Body Type</LabelWithStar>} />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/*-------------------------------------------- Fuel Type ------------------------------------*/}

          {/* <Grid size={{ xs: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Fuel Type</LabelWithStar>}
              fullWidth
              value={data.fuel_type_id}
              onChange={e => handleChange('fuel_type_id', e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              {fuelTypes.map(fuel => (
                <MenuItem key={fuel.id} value={fuel.id}>
                  {fuel.fuel_name || fuel.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid> */}

          <Grid size={{ xs: 6 }}>
            <Autocomplete
              fullWidth
              options={fuelTypes}
              getOptionLabel={option => option.fuel_name || option.name || ''}
              value={fuelTypes.find(fuel => fuel.id === data.fuel_type_id) || null}
              onChange={(event, newValue) => handleChange('fuel_type_id', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Fuel Type</LabelWithStar>} />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/* ----------------------------------------Color Dropdown--------------------------------------------------------- */}
          {/* <Grid size={{ xs: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Color</LabelWithStar>}
              fullWidth
              value={data.color_id}
              onChange={e => handleChange('color_id', e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              {colors.map(color => (
                <MenuItem key={color.id} value={color.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: color.color_code || color.code || color.color_name,
                        border: '1px solid #ccc'
                      }}
                    />

                    <span>{color.color_name || color.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid> */}

<Grid size={{ xs: 6 }}>
  <CustomTextField
    select
    label={<LabelWithStar>Color</LabelWithStar>}
    fullWidth
    value={
      typeof data.color_id === 'string'
        ? data.color_id.split(',').map(id => id.trim())
        : Array.isArray(data.color_id)
        ? data.color_id
        : []
    }
    onChange={e => {
      const selectedIds = e.target.value
      handleChange('color_id', selectedIds.join(','))
    }}
    SelectProps={{
      multiple: true,
      renderValue: selected => {
        const selectedNames = colors
          .filter(color => selected.includes(String(color.id)))
          .map(color => color.color_name || color.name)
        return selectedNames.join(', ')
      },
    }}
  >
    {colors.map(color => (
      <MenuItem key={color.id} value={String(color.id)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 🔵 Color Preview Circle */}
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: color.color_code || '#ccc', // fallback gray
              border: '1px solid #ccc',
            }}
          />
          {/* 🏷️ Color Name */}
          <span>{color.color_name || color.name}</span>
        </Box>
      </MenuItem>
    ))}
  </CustomTextField>
</Grid>






          {/* -------------------------------cylinder---------------------------------------------- */}

          <Grid size={{ xs: 6 }}>
            <CustomTextField
              select
              fullWidth
              label={<LabelWithStar>Cylinders</LabelWithStar>}

              value={
                typeof data.cylinder_no === 'string' && data.cylinder_no
                  ? data.cylinder_no.split(',').map(s => s.trim())
                  : []
              }
              onChange={e => handleChange('cylinder_no', e.target.value.join(', '))}
              SelectProps={{
                multiple: true,
                renderValue: selected => selected.join(', ')
              }}
            >
              {Array.isArray(cylinderNo) &&
                cylinderNo.map(cylinder => {
                  const value = cylinder.name || cylinder.cylinder_name

                  return (
                    <MenuItem key={value} value={value}>
                      {cylinder.cylinder_name || cylinder.name}
                    </MenuItem>
                  )
                })}
            </CustomTextField>
          </Grid>



          {/* -----------------------------------Mileage Dropdown------------------------------------ */}
          {/* <Grid size={{ xs: 6 }}>
            <CustomTextField
              select
              label={<LabelWithStar>Mileage</LabelWithStar>}
              fullWidth
              value={data.mileage_id} // Use separate state
              onChange={e => handleChange('mileage_id', e.target.value)}
              SelectProps={{ displayEmpty: true }}
            >
              {mileages.map(
                (
                  mileage // You need a mileages array fetched from API
                ) => (
                  <MenuItem key={mileage.id} value={mileage.id}>
                    {mileage.mileage_name || mileage.name}
                  </MenuItem>
                )
              )}
            </CustomTextField>
          </Grid> */}

          <Grid size={{ xs: 6 }}>
            <Autocomplete
              fullWidth
              options={mileages}
              getOptionLabel={option => option.mileage_name || option.name || ''}
              value={mileages.find(m => m.id === data.mileage_id) || null}
              onChange={(event, newValue) => handleChange('mileage_id', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Mileage</LabelWithStar>} />}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          {/*-------------------------------- Transmission------------------------------------- */}
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
              value={data.tank_capacity}
              onChange={e => handleChange('tank_capacity', e.target.value)}
            />
          </Grid>

          {/* Remarks */}
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label='Remarks'
              fullWidth
              multiline
              rows={2}
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

// sutocompletre code

{
  /* <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              fullWidth
              options={bodyTypes}
              getOptionLabel={option => option.body_type_name || ''}
              value={bodyTypes.find(opt => opt.id === data.body_type_id) || null}
              onChange={(e, newValue) => handleChange('body_type_id', newValue ? newValue.id : '')}
              renderInput={params => <CustomTextField {...params} label={<LabelWithStar>Body Type</LabelWithStar>} />}
            />
          </Grid> */
}
