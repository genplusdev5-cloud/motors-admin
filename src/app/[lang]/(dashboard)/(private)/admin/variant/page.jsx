'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

import {
  Box,
  Button,
  Card,
  CardHeader,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Drawer,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Chip,
  TextField,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import GlobalTextField from '@/components/common/GlobalTextField'
import GlobalTextarea from '@/components/common/GlobalTextarea'
import GlobalSelect from '@/components/common/GlobalSelect'
import GlobalButton from '@/components/common/GlobalButton'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { showToast } from '@/components/common/Toasts'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'

// Debounced Search Input
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value])
  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default function VariantPage() {
  const ENTITY = 'Variant'

  const [rows, setRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, row: null })
  const [exportAnchorEl, setExportAnchorEl] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [formData, setFormData] = useState({
    id: null,
    variant_name: '',
    fuel_type: '',
    no_of_cylinders: '',
    max_torque: '',
    transmission_type: '',
    fuel_tank_capacity: '',
    body_type: '',
    seating_capacity: '',
    variant_series: '',
    description: '',
    status: 1
  })

  const nameRef = useRef(null)

  // Load List UI only
  const loadList = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      showToast('info', `Refreshed (UI Only)`)
    }, 300)
  }

  useEffect(() => {
    loadList()
  }, [])

  const toggleDrawer = () => setDrawerOpen(p => !p)

  const handleAdd = () => {
    setIsEdit(false)
    setFormData({
      id: null,
      variant_name: '',
      fuel_type: '',
      no_of_cylinders: '',
      max_torque: '',
      transmission_type: '',
      fuel_tank_capacity: '',
      body_type: '',
      seating_capacity: '',
      variant_series: '',
      description: '',
      status: 1
    })
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 100)
  }

  const handleEdit = row => {
    setIsEdit(true)
    setFormData({ ...row })
    setDrawerOpen(true)
  }

  const handleFieldChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleCancel = () => setDrawerOpen(false)

  // Add / Update
  const handleSubmit = e => {
    e.preventDefault()

    if (!formData.variant_name.trim())
      return showToast('warning', 'Variant Name required')

    setLoading(true)
    try {
      if (isEdit) {
        setRows(prev =>
          prev.map(r => (r.id === formData.id ? { ...formData } : r))
        )
        showToast('success', 'Variant Updated (UI only)')
      } else {
        const newRow = {
          ...formData,
          id: Date.now(),
          sno: rows.length + 1
        }
        setRows(prev => [...prev, newRow])
        showToast('success', 'Variant Added (UI only)')
      }
      setDrawerOpen(false)
    } finally {
      setLoading(false)
    }
  }

  // Delete
  const confirmDelete = () => {
    setDeleteLoading(true)
    try {
      setRows(prev =>
        prev
          .filter(r => r.id !== deleteDialog.row.id)
          .map((r, i) => ({ ...r, sno: i + 1 }))
      )
      showToast('delete', 'Variant Deleted (UI only)')
    } finally {
      setDeleteLoading(false)
      setDeleteDialog({ open: false, row: null })
    }
  }

  // Table Columns
  const columnHelper = createColumnHelper()
  const columns = useMemo(
    () => [
      columnHelper.accessor('sno', { header: 'S.No' }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size='small'
              color='primary'
              onClick={() => handleEdit(info.row.original)}
            >
              <i className='tabler-edit text-blue-600 text-lg' />
            </IconButton>
            <IconButton
              size='small'
              color='error'
              onClick={() =>
                setDeleteDialog({ open: true, row: info.row.original })
              }
            >
              <i className='tabler-trash text-red-600 text-lg' />
            </IconButton>
          </Box>
        )
      }),
      columnHelper.accessor('variant_name', { header: 'Variant Name' }),
      columnHelper.accessor('fuel_type', { header: 'Fuel Type' }),
      columnHelper.accessor('no_of_cylinders', { header: 'Cylinders' }),
      columnHelper.accessor('max_torque', { header: 'Max Torque' }),
      columnHelper.accessor('transmission_type', { header: 'Transmission' }),
      columnHelper.accessor('fuel_tank_capacity', { header: 'Fuel Tank (L)' }),
      columnHelper.accessor('body_type', { header: 'Body Type' }),
      columnHelper.accessor('seating_capacity', { header: 'Seating' }),
      columnHelper.accessor('variant_series', { header: 'Series' })
    ],
    []
  )

  const filteredRows = useMemo(() => {
    if (!searchText) return rows
    const s = searchText.toLowerCase()
    return rows.filter(r =>
      Object.values(r).some(val =>
        String(val).toLowerCase().includes(s)
      )
    )
  }, [rows, searchText])

  const paginatedRows = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination])

  const table = useReactTable({
    data: paginatedRows,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(filteredRows.length / pagination.pageSize),
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  const exportOpen = Boolean(exportAnchorEl)
  const exportAction = () => showToast('info', 'Export UI only')

  return (
    <Box>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs>
          <Link href='/'>Home</Link>
          <Link href='/masters'>Masters</Link>
          <Typography color='text.primary'>{ENTITY}</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h5'>{ENTITY}</Typography>
              <GlobalButton
                startIcon={
                  <RefreshIcon
                    sx={{
                      animation: loading ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }}
                  />
                }
                disabled={loading}
                onClick={loadList}
              >
                Refresh
              </GlobalButton>
            </Box>
          }
          action={
            <Box display='flex' gap={2}>
              <GlobalButton
                variant='outlined'
                color='secondary'
                endIcon={<ArrowDropDownIcon />}
                onClick={e => setExportAnchorEl(e.currentTarget)}
              >
                Export
              </GlobalButton>

              <Menu
                anchorEl={exportAnchorEl}
                open={exportOpen}
                onClose={() => setExportAnchorEl(null)}
              >
                <MenuItem onClick={exportAction}>Print</MenuItem>
                <MenuItem onClick={exportAction}>CSV</MenuItem>
                <MenuItem onClick={exportAction}>Excel</MenuItem>
                <MenuItem onClick={exportAction}>PDF</MenuItem>
                <MenuItem onClick={exportAction}>Copy</MenuItem>
              </Menu>

              <GlobalButton startIcon={<AddIcon />} onClick={handleAdd}>
                Add Variant
              </GlobalButton>
            </Box>
          }
        />

        <Divider sx={{ mb: 2 }} />

        {/* Search Controls */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box display='flex' alignItems='center' gap={1}>
            <Typography>Show</Typography>
            <FormControl size='small' sx={{ width: 120 }}>
              <Select
                value={pagination.pageSize}
                onChange={e =>
                  setPagination(p => ({
                    ...p,
                    pageSize: Number(e.target.value)
                  }))
                }
              >
                {[5, 10, 25, 50, 100].map(v => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <DebouncedInput
            value={searchText}
            onChange={v => setSearchText(String(v))}
            placeholder='Search...'
            variant='outlined'
            size='small'
            sx={{ width: 320 }}
          />
        </Box>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center py-4'>
                    No Data Available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePaginationComponent
          table={table}
          totalCount={filteredRows.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      </Card>

      {/* Drawer Form */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { width: 440 } }}
      >
        <Box sx={{ p: 4 }}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h5'>
              {isEdit ? 'Edit Variant' : 'Add Variant'}
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <GlobalTextField
                  label='Variant Name *'
                  value={formData.variant_name}
                  required
                  inputRef={nameRef}
                  onChange={e =>
                    handleFieldChange('variant_name', e.target.value)
                  }
                />
              </Grid>

              {/* Fuel Type */}
              <Grid item xs={12}>
                <GlobalSelect
                  label='Fuel Type'
                  value={formData.fuel_type}
                  onChange={v => handleFieldChange('fuel_type', v)}
                  options={[
                    { value: 'Petrol', label: 'Petrol' },
                    { value: 'Diesel', label: 'Diesel' },
                    { value: 'Electric', label: 'Electric' },
                    { value: 'CNG', label: 'CNG' }
                  ]}
                />
              </Grid>

              {/* No of Cylinders */}
              <Grid item xs={12}>
                <GlobalTextField
                  type='number'
                  label='No. of Cylinders'
                  value={formData.no_of_cylinders}
                  onChange={e =>
                    handleFieldChange('no_of_cylinders', e.target.value)
                  }
                />
              </Grid>

              {/* Max Torque */}
              <Grid item xs={12}>
                <GlobalTextField
                  label='Max Torque'
                  placeholder='Eg: 200 Nm @ 4000 rpm'
                  value={formData.max_torque}
                  onChange={e =>
                    handleFieldChange('max_torque', e.target.value)
                  }
                />
              </Grid>

              {/* Transmission Type */}
              <Grid item xs={12}>
                <GlobalSelect
                  label='Transmission Type'
                  value={formData.transmission_type}
                  onChange={v =>
                    handleFieldChange('transmission_type', v)
                  }
                  options={[
                    { value: 'Manual', label: 'Manual' },
                    { value: 'Automatic', label: 'Automatic' },
                    { value: 'AMT', label: 'AMT' }
                  ]}
                />
              </Grid>

              {/* Fuel Tank Capacity */}
              <Grid item xs={12}>
                <GlobalTextField
                  type='number'
                  label='Fuel Tank Capacity (Litres)'
                  value={formData.fuel_tank_capacity}
                  onChange={e =>
                    handleFieldChange('fuel_tank_capacity', e.target.value)
                  }
                />
              </Grid>

              {/* Body Type Dropdown */}
              <Grid item xs={12}>
                <GlobalSelect
                  label='Body Type'
                  value={formData.body_type}
                  onChange={v =>
                    handleFieldChange('body_type', v)
                  }
                  options={[
                    { value: 'Sedan', label: 'Sedan' },
                    { value: 'SUV', label: 'SUV' },
                    { value: 'Hatchback', label: 'Hatchback' }
                  ]}
                />
              </Grid>

              {/* Seating Capacity */}
              <Grid item xs={12}>
                <GlobalTextField
                  type='number'
                  label='Seating Capacity'
                  value={formData.seating_capacity}
                  onChange={e =>
                    handleFieldChange('seating_capacity', e.target.value)
                  }
                />
              </Grid>

              {/* Variant Series */}
              <Grid item xs={12}>
                <GlobalTextField
                  label='Variant Series'
                  placeholder='Eg: VXI, LXI, Sport'
                  value={formData.variant_series}
                  onChange={e =>
                    handleFieldChange('variant_series', e.target.value)
                  }
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <GlobalTextarea
                  label='Description'
                  rows={3}
                  value={formData.description}
                  onChange={e =>
                    handleFieldChange('description', e.target.value)
                  }
                />
              </Grid>

              {/* Status (only Edit mode) */}
              {isEdit && (
                <Grid item xs={12}>
                  <GlobalSelect
                    label='Status'
                    value={formData.status === 1 ? 'Active' : 'Inactive'}
                    onChange={e =>
                      handleFieldChange(
                        'status',
                        e.target.value === 'Active' ? 1 : 0
                      )
                    }
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' }
                    ]}
                  />
                </Grid>
              )}
            </Grid>

            <Box display='flex' gap={2} mt={4}>
              <GlobalButton fullWidth type='submit' disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update' : 'Save'}
              </GlobalButton>
              <GlobalButton
                fullWidth
                variant='outlined'
                color='secondary'
                onClick={handleCancel}
              >
                Cancel
              </GlobalButton>
            </Box>
          </form>
        </Box>
      </Drawer>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, row: null })}
      >
        <DialogTitle>
          <WarningAmberIcon color='error' /> Confirm Delete
          <DialogCloseButton
            onClick={() => setDeleteDialog({ open: false, row: null })}
          />
        </DialogTitle>
        <DialogContent>
          Are you sure want to delete{' '}
          <strong>{deleteDialog.row?.variant_name}</strong> ?
        </DialogContent>
        <DialogActions>
          <GlobalButton
            variant='outlined'
            onClick={() => setDeleteDialog({ open: false, row: null })}
          >
            Cancel
          </GlobalButton>
          <GlobalButton
            color='error'
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </GlobalButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
