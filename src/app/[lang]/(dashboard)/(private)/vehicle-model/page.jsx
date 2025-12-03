'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import RefreshIcon from '@mui/icons-material/Refresh'
import PrintIcon from '@mui/icons-material/Print'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import TableChartIcon from '@mui/icons-material/TableChart'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

import { showToast } from '@/components/common/Toasts'

// Table
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { useTheme } from '@mui/material/styles'
import styles from '@core/styles/table.module.css'

// API
import { getVehicleModelList, addVehicleModel, updateVehicleModel, deleteVehicleModel } from '@/api/vehicle-model'

// Local reusable components (swap if not present)
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import GlobalButton from '@/components/common/GlobalButton'
import GlobalTextField from '@/components/common/GlobalTextField'
import GlobalTextarea from '@/components/common/GlobalTextarea'
import GlobalSelect from '@/components/common/GlobalSelect'

const columnHelper = createColumnHelper()

export default function VehicleModelPage() {
  const theme = useTheme()

  // table data
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  // drawer / form
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    vehicle_type_id: '',
    category_id: '',
    subcategory_id: '',
    make_id: '',
    enginee_type_id: '',
    fuel_type_id: '',
    body_type_id: '',
    color_id: '',
    cylinder_no: '',
    power: '',
    transmission: '',
    seating_capacity: '',
    no_of_weels: '',
    tank_capacity: '',
    mileage_id: '',
    remarks: '',
    is_active: 1
  })
  const nameRef = useRef(null)

  // delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, row: null })
  const [deleteLoading, setDeleteLoading] = useState(false)

  // export menu
  const [exportAnchorEl, setExportAnchorEl] = useState(null)

  // Load list
  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getVehicleModelList()
      // API may return an object: { status, message, data: [...] }
      const list = Array.isArray(res) ? res : (res?.data ?? res?.data?.data ?? [])
      const normalized = list.map((item, idx) => ({
        sno: idx + 1,
        ...item
      }))
      setRows(normalized)
    } catch (err) {
      console.error('LOAD VEHICLE MODELS ERROR', err)
      showToast('error', err?.message || 'Failed to load vehicle models')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadList()
  }, [loadList])

  // Open add drawer
  const handleAdd = () => {
    setIsEdit(false)
    setFormData({
      id: null,
      name: '',
      vehicle_type_id: '',
      category_id: '',
      subcategory_id: '',
      make_id: '',
      enginee_type_id: '',
      fuel_type_id: '',
      body_type_id: '',
      color_id: '',
      cylinder_no: '',
      power: '',
      transmission: '',
      seating_capacity: '',
      no_of_weels: '',
      tank_capacity: '',
      mileage_id: '',
      remarks: '',
      is_active: 1
    })
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 120)
  }

  // Open edit drawer
  const handleEditOpen = row => {
    setIsEdit(true)
    // row is original api item (includes many fields)
    setFormData({
      id: row.id,
      name: row.name || '',
      vehicle_type_id: row.vehicle_type_id ?? '',
      category_id: row.category_id ?? '',
      subcategory_id: row.subcategory_id ?? '',
      make_id: row.make_id ?? '',
      enginee_type_id: row.enginee_type_id ?? '',
      fuel_type_id: row.fuel_type_id ?? '',
      body_type_id: row.body_type_id ?? '',
      color_id: row.color_id ?? '',
      cylinder_no: row.cylinder_no ?? '',
      power: row.power ?? '',
      transmission: row.transmission ?? '',
      seating_capacity: row.seating_capacity ?? '',
      no_of_weels: row.no_of_weels ?? '',
      tank_capacity: row.tank_capacity ?? '',
      mileage_id: row.mileage_id ?? '',
      remarks: row.remarks ?? '',
      is_active: row.is_active ?? 1
    })
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 120)
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    setDrawerOpen(false)
    setFormData(prev => ({ ...prev, id: null }))
  }

  // Save (add/update)
  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.name || !formData.name.trim()) {
      showToast('warning', 'Model name is required')
      return
    }

    // front duplicate check
    const duplicate = rows.find(
      r => r.name?.trim().toLowerCase() === formData.name.trim().toLowerCase() && r.id !== formData.id
    )
    if (duplicate) {
      showToast('warning', 'Model name already exists')
      return
    }

    setLoading(true)
    try {
      // Build payload (your backend expects JSON)
      const payload = {
        name: formData.name.trim(),
        vehicle_type_id: formData.vehicle_type_id || null,
        category_id: formData.category_id || null,
        subcategory_id: formData.subcategory_id || null,
        make_id: formData.make_id || null,
        enginee_type_id: formData.enginee_type_id || null,
        fuel_type_id: formData.fuel_type_id || null,
        body_type_id: formData.body_type_id || null,
        color_id: formData.color_id || '',
        cylinder_no: formData.cylinder_no || '',
        power: formData.power || '',
        transmission: formData.transmission || '',
        seating_capacity: formData.seating_capacity ? Number(formData.seating_capacity) : null,
        no_of_weels: formData.no_of_weels ? Number(formData.no_of_weels) : null,
        tank_capacity: formData.tank_capacity ? Number(formData.tank_capacity) : null,
        mileage_id: formData.mileage_id || '',
        remarks: formData.remarks || '',
        is_active: Number(formData.is_active)
      }

      let res
      if (isEdit && formData.id) {
        res = await updateVehicleModel(formData.id, payload)
        showToast('success', 'Vehicle model updated')
      } else {
        res = await addVehicleModel(payload)
        showToast('success', 'Vehicle model added')
      }

      setDrawerOpen(false)
      await loadList()
    } catch (err) {
      console.error('SAVE VEHICLE MODEL ERROR', err)
      const msg = err?.message || err?.data?.message || 'Failed to save vehicle model'
      showToast('error', msg)
    } finally {
      setLoading(false)
    }
  }

  // Delete
  const handleDelete = id => {
    setDeleteDialog({ open: true, row: { id } })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.row) return
    setDeleteLoading(true)
    try {
      await deleteVehicleModel(deleteDialog.row.id)
      showToast('success', 'Vehicle model deleted')
      await loadList()
      setDeleteDialog({ open: false, row: null })
    } catch (err) {
      console.error('DELETE ERROR', err)
      showToast('error', err?.message || 'Delete failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Export helpers
  const exportPrint = () => {
    const w = window.open('', '_blank')
    const html = `
      <html><head><title>Vehicle Models</title><style>
        body{font-family:Arial;padding:20px}
        table{width:100%;border-collapse:collapse}
        th,td{border:1px solid #ddd;padding:8px;text-align:left}
        th{background:#f4f4f4}
      </style></head><body>
      <h3>Vehicle Model List</h3>
      <table><thead><tr><th>S.No</th><th>Name</th><th>Vehicle Type</th><th>Make</th><th>Status</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td>${r.sno}</td><td>${r.name || ''}</td><td>${r.vehicle_type_name || ''}</td><td>${r.make_name || ''}</td><td>${r.is_active == 1 ? 'Active' : 'Inactive'}</td></tr>`).join('')}
      </tbody></table></body></html>`
    w?.document.write(html)
    w?.document.close()
    w?.print()
  }

  const exportCSV = () => {
    const headers = ['S.No', 'Name', 'Vehicle Type', 'Make', 'Status']
    const csv = [
      headers.join(','),
      ...rows.map(r =>
        [
          r.sno,
          `"${(r.name || '').replace(/"/g, '""')}"`,
          `"${(r.vehicle_type_name || '').replace(/"/g, '""')}"`,
          `"${(r.make_name || '').replace(/"/g, '""')}"`,
          r.is_active == 1 ? 'Active' : 'Inactive'
        ].join(',')
      )
    ].join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = 'VehicleModel_List.csv'
    link.click()
    showToast('success', 'CSV downloaded')
  }

  const exportExcel = async () => {
    if (typeof window === 'undefined') return
    const { utils, writeFile } = await import('xlsx')
    const ws = utils.json_to_sheet(
      rows.map(r => ({
        'S.No': r.sno,
        Name: r.name,
        'Vehicle Type': r.vehicle_type_name || '-',
        Make: r.make_name || '-',
        Status: r.is_active == 1 ? 'Active' : 'Inactive'
      }))
    )
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'VehicleModels')
    writeFile(wb, 'VehicleModel_List.xlsx')
    showToast('success', 'Excel downloaded')
  }

  const exportPDF = async () => {
    if (typeof window === 'undefined') return
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()
    doc.text('Vehicle Model List', 14, 15)
    autoTable(doc, {
      startY: 25,
      head: [['S.No', 'Name', 'Vehicle Type', 'Make', 'Status']],
      body: rows.map(r => [
        r.sno,
        r.name || '-',
        r.vehicle_type_name || '-',
        r.make_name || '-',
        r.is_active == 1 ? 'Active' : 'Inactive'
      ])
    })
    doc.save('VehicleModel_List.pdf')
    showToast('success', 'PDF exported')
  }

  const exportCopy = () => {
    const text = rows
      .map(
        r =>
          `${r.sno}. ${r.name || '-'} | ${r.vehicle_type_name || '-'} | ${r.make_name || '-'} | ${r.is_active == 1 ? 'Active' : 'Inactive'}`
      )
      .join('\n')
    navigator.clipboard.writeText(text)
    showToast('info', 'Copied to clipboard')
  }

  // Table setup (basic columns displayed)
  const columns = useMemo(
    () => [
      columnHelper.accessor('sno', { header: 'S.No' }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size='small' color='primary' onClick={() => handleEditOpen(row.original)}>
              <i className='tabler-edit' style={{ fontSize: 18 }} />
            </IconButton>
            <IconButton size='small' color='error' onClick={() => handleDelete(row.original.id)}>
              <i className='tabler-trash' style={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )
      }),
      columnHelper.accessor('name', { header: 'Model Name' }),
      columnHelper.accessor('vehicle_type_name', { header: 'Vehicle Type' }),
      columnHelper.accessor('make_name', { header: 'Make' }),
      columnHelper.accessor('mileage_name', { header: 'Mileage' }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: info => (
          <Chip
            label={info.getValue() == 1 ? 'Active' : 'Inactive'}
            size='small'
            sx={{ color: '#fff', bgcolor: info.getValue() == 1 ? 'success.main' : 'error.main', fontWeight: 600 }}
          />
        )
      })
    ],
    [rows]
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter: searchText, pagination },
    onGlobalFilterChange: setSearchText,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  // filtered & paged rows are handled by table state, but we also use simple search for client side
  const filteredCount = rows.filter(r => {
    if (!searchText) return true
    const q = searchText.toLowerCase()
    return (
      (r.name || '').toLowerCase().includes(q) ||
      (r.make_name || '').toLowerCase().includes(q) ||
      (r.vehicle_type_name || '').toLowerCase().includes(q)
    )
  }).length

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link href='/' style={{ textDecoration: 'none' }}>
            Home
          </Link>
          <Typography color='text.primary'>Vehicle Model</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                Vehicle Model
              </Typography>
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
            <Box display='flex' alignItems='center' gap={2}>
              <GlobalButton
                variant='outlined'
                color='secondary'
                endIcon={<ArrowDropDownIcon />}
                onClick={e => setExportAnchorEl(e.currentTarget)}
              >
                Export
              </GlobalButton>
              <Menu anchorEl={exportAnchorEl} open={Boolean(exportAnchorEl)} onClose={() => setExportAnchorEl(null)}>
                <MenuItem
                  onClick={() => {
                    setExportAnchorEl(null)
                    exportPrint()
                  }}
                >
                  <PrintIcon fontSize='small' sx={{ mr: 1 }} /> Print
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setExportAnchorEl(null)
                    exportCSV()
                  }}
                >
                  <FileDownloadIcon fontSize='small' sx={{ mr: 1 }} /> CSV
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    setExportAnchorEl(null)
                    await exportExcel()
                  }}
                >
                  <TableChartIcon fontSize='small' sx={{ mr: 1 }} /> Excel
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    setExportAnchorEl(null)
                    await exportPDF()
                  }}
                >
                  <PictureAsPdfIcon fontSize='small' sx={{ mr: 1 }} /> PDF
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setExportAnchorEl(null)
                    exportCopy()
                  }}
                >
                  <FileCopyIcon fontSize='small' sx={{ mr: 1 }} /> Copy
                </MenuItem>
              </Menu>

              <GlobalButton startIcon={<AddIcon />} onClick={handleAdd}>
                Add Vehicle Model
              </GlobalButton>
            </Box>
          }
          sx={{ pb: 1.5, pt: 1.5, '& .MuiCardHeader-action': { m: 0, alignItems: 'center' } }}
        />

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              Show
            </Typography>
            <FormControl size='small' sx={{ width: 140 }}>
              <Select
                value={pagination.pageSize}
                onChange={e => setPagination(p => ({ ...p, pageSize: Number(e.target.value) }))}
              >
                {[5, 10, 25, 50, 100].map(v => (
                  <MenuItem key={v} value={v}>
                    {v} entries
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            size='small'
            placeholder='Search model...'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            sx={{ width: 360 }}
          />
        </Box>

        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: 16 }}>
                    Loading...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: 16 }}>
                    No data available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePaginationComponent
          table={table}
          totalCount={filteredCount}
          pagination={pagination}
          setPagination={setPagination}
        />
      </Card>

      {/* Drawer Add/Edit */}
      <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 520 } }}>
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
            <Typography variant='h6'>{isEdit ? 'Edit Vehicle Model' : 'Add Vehicle Model'}</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <GlobalTextField
                  label='Model Name *'
                  value={formData.name}
                  inputRef={nameRef}
                  required
                  onChange={e => handleFieldChange('name', e.target.value)}
                />
              </Grid>

              {/* Simple selects — replace options with API-driven data as needed */}
              <Grid item xs={6}>
                <GlobalTextField
                  label='Vehicle Type ID'
                  value={formData.vehicle_type_id}
                  onChange={e => handleFieldChange('vehicle_type_id', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <GlobalTextField
                  label='Make ID'
                  value={formData.make_id}
                  onChange={e => handleFieldChange('make_id', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <GlobalTextarea
                  label='Remarks'
                  rows={3}
                  value={formData.remarks}
                  onChange={e => handleFieldChange('remarks', e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <GlobalSelect
                  label='Status'
                  value={formData.is_active === 1 ? 'Active' : 'Inactive'}
                  onChange={e => handleFieldChange('is_active', e.target.value === 'Active' ? 1 : 0)}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' }
                  ]}
                />
              </Grid>

              <Grid item xs={6}>
                <GlobalTextField
                  label='Seating Capacity'
                  value={formData.seating_capacity}
                  onChange={e => handleFieldChange('seating_capacity', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box mt={3} display='flex' gap={2}>
              <GlobalButton type='submit' fullWidth disabled={loading}>
                {loading ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update' : 'Save'}
              </GlobalButton>
              <GlobalButton variant='outlined' color='secondary' fullWidth onClick={handleCancel} disabled={loading}>
                Cancel
              </GlobalButton>
            </Box>
          </form>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, row: null })}
        PaperProps={{ sx: { overflow: 'visible', width: 420, borderRadius: 1, textAlign: 'center' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: 'error.main',
            fontWeight: 700,
            pb: 1,
            position: 'relative'
          }}
        >
          <WarningAmberIcon color='error' sx={{ fontSize: 26 }} />
          Confirm Delete
          <DialogCloseButton onClick={() => setDeleteDialog({ open: false, row: null })} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>

        <DialogContent sx={{ px: 5, pt: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: '#d32f2f' }}>{deleteDialog.row?.name || 'this make'}</strong>?
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, pt: 2 }}>
          <GlobalButton
            variant='outlined'
            color='secondary'
            onClick={() => setDeleteDialog({ open: false, row: null })}
          >
            Cancel
          </GlobalButton>
          <GlobalButton variant='contained' color='error' onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </GlobalButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
