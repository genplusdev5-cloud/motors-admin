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
  InputLabel,
  CircularProgress
} from '@mui/material'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import ProgressCircularCustomization from '@/components/common/ProgressCircularCustomization'

import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import PrintIcon from '@mui/icons-material/Print'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import TableChartIcon from '@mui/icons-material/TableChart'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'

import GlobalTextField from '@/components/common/GlobalTextField'
import GlobalTextarea from '@/components/common/GlobalTextarea'
import GlobalSelect from '@/components/common/GlobalSelect'
import GlobalButton from '@/components/common/GlobalButton'

import classnames from 'classnames'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'
import ChevronRight from '@menu/svg/ChevronRight'

import { showToast } from '@/components/common/Toasts'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// ⛽ API IMPORTS
import { getGearbox, addGearbox, updateGearbox, deleteGearBox } from '@/api/gearbox'

// ───────────────────── Debounced Input ─────────────────────
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value])
  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// ───────────────────── Main Component ─────────────────────
export default function GearboxPage() {
  const [rows, setRows] = useState([])
  const [rowCount, setRowCount] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [exportAnchorEl, setExportAnchorEl] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, row: null })
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    status: 1
  })

  const nameRef = useRef(null)

  // ───────────────────── Load Gearbox List ─────────────────────
  const loadGearbox = async () => {
    setLoading(true)
    try {
      const res = await getGearbox()
      const list = Array.isArray(res) ? res : []

      const normalized = list.map((item, index) => ({
        sno: index + 1,
        id: item.id,
        name: item.name,
        description: item.description || '',
        is_active: item.is_active
      }))

      setRows(normalized)
      setRowCount(normalized.length)
    } catch (err) {
      showToast('error', 'Failed to load Gearbox List')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGearbox()
  }, [])

  // ───────────────────── Drawer Controls ─────────────────────
  const handleAdd = () => {
    setIsEdit(false)
    setFormData({ id: null, name: '', description: '', status: 1 })
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 100)
  }

  const handleEdit = row => {
    setIsEdit(true)
    setFormData({
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.is_active
    })
    setDrawerOpen(true)
  }

  const handleCancel = () => {
    setDrawerOpen(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // ───────────────────── Submit Add / Edit ─────────────────────
  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showToast('warning', 'Gearbox name is required')
      return
    }

    setLoading(true)
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim(),
        is_active: Number(formData.status)
      }

      let res
      if (isEdit) res = await updateGearbox(formData.id, payload)
      else res = await addGearbox(payload)

      showToast('success', isEdit ? 'Gearbox updated' : 'Gearbox added')
      setDrawerOpen(false)
      await loadGearbox()
    } catch (err) {
      showToast('error', 'Failed to save Gearbox')
    } finally {
      setLoading(false)
    }
  }

  // ───────────────────── Delete ─────────────────────
  const confirmDelete = async () => {
    try {
      await deleteGearBox(deleteDialog.row.id)
      showToast('delete', `${deleteDialog.row.name} deleted`)
      await loadGearbox()
    } catch (err) {
      showToast('error', 'Failed to delete Gearbox')
    }

    setDeleteDialog({ open: false, row: null })
  }

  // ───────────────────── Table Filtering + Pagination ─────────────────────
  const filteredRows = useMemo(() => {
    if (!searchText) return rows
    return rows.filter(
      r =>
        r.name.toLowerCase().includes(searchText.toLowerCase()) ||
        r.description.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [rows, searchText])

  const paginatedRows = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination])

  // ───────────────────── Table Columns ─────────────────────
  const columnHelper = createColumnHelper()
  const columns = [
    columnHelper.accessor('sno', { header: 'S.No' }),
     columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size='small' color='primary' onClick={() => handleEdit(info.row.original)}>
            <i className='tabler-edit text-blue-600 text-lg' />
          </IconButton>
          <IconButton
            size='small'
            color='error'
            onClick={() => setDeleteDialog({ open: true, row: info.row.original })}
          >
            <i className='tabler-trash text-red-600 text-lg' />
          </IconButton>
        </Box>
      )
    }),
    columnHelper.accessor('name', { header: 'Gearbox Name' }),
    columnHelper.accessor('description', { header: 'Description' }),
    columnHelper.accessor('is_active', {
      header: 'Status',
      cell: info => (
        <Chip
          label={info.getValue() == 1 ? 'Active' : 'Inactive'}
          size='small'
          sx={{
            color: '#fff',
            bgcolor: info.getValue() == 1 ? 'success.main' : 'error.main',
            borderRadius: '6px',
            px: 1.5
          }}
        />
      )
    }),

  ]

  const table = useReactTable({
    data: paginatedRows,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(filteredRows.length / pagination.pageSize),
    state: { globalFilter: searchText, pagination },
    onGlobalFilterChange: setSearchText,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  // ───────────────────── Export Functions ─────────────────────
  const exportCSV = () => {
    const csv = [
      ['S.No', 'Gearbox Name', 'Description', 'Status'].join(','),
      ...rows.map(r => [r.sno, r.name, r.description, r.is_active ? 'Active' : 'Inactive'].join(','))
    ].join('\n')

    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = 'Gearbox_List.csv'
    link.click()
    showToast('success', 'CSV downloaded')
  }

  const exportCopy = () => {
    const text = rows
      .map(r => `${r.sno}. ${r.name} | ${r.description} | ${r.is_active ? 'Active' : 'Inactive'}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    showToast('info', 'Copied to clipboard')
  }

  // ───────────────────── UI Render ─────────────────────
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
        <Link href='/'>Home</Link>
        <Typography color='text.primary'>Gearbox Type</Typography>
      </Breadcrumbs>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h5' fontWeight={600}>
                Gearbox Management
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
                onClick={loadGearbox}
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

              <Menu anchorEl={exportAnchorEl} open={Boolean(exportAnchorEl)} onClose={() => setExportAnchorEl(null)}>
                <MenuItem
                  onClick={() => {
                    setExportAnchorEl(null)
                    exportCSV()
                  }}
                >
                  <FileDownloadIcon sx={{ mr: 1 }} /> CSV
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setExportAnchorEl(null)
                    exportCopy()
                  }}
                >
                  <FileCopyIcon sx={{ mr: 1 }} /> Copy
                </MenuItem>
              </Menu>

              <GlobalButton startIcon={<AddIcon />} onClick={handleAdd}>
                Add Gearbox
              </GlobalButton>
            </Box>
          }
          sx={{ pb: 1.5 }}
        />

        <Divider sx={{ mb: 2 }} />

        {/* Search + Page Size */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControl size='small' sx={{ width: 140 }}>
            <Select
              value={pagination.pageSize}
              onChange={e => setPagination(p => ({ ...p, pageSize: e.target.value }))}
            >
              {[10, 25, 50, 100].map(v => (
                <MenuItem key={v} value={v}>
                  {v} entries
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DebouncedInput
            value={searchText}
            onChange={value => setSearchText(String(value))}
            placeholder='Search Gearbox...'
            variant='outlined'
            size='small'
            sx={{ width: 300 }}
          />
        </Box>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center py-4'>
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
          totalCount={filteredRows.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      </Card>

      {/* Drawer (Add/Edit) */}
      <Drawer anchor='right' open={drawerOpen} onClose={handleCancel} PaperProps={{ sx: { width: 400 } }}>
        <Box sx={{ p: 5 }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>{isEdit ? 'Edit Gearbox' : 'Add Gearbox'}</Typography>
            <IconButton onClick={handleCancel}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <GlobalTextField
                  label='Gearbox Name *'
                  placeholder='Enter gearbox name'
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  inputRef={nameRef}
                />
              </Grid>

              <Grid item xs={12}>
                <GlobalTextarea
                  label='Description'
                  placeholder='Optional description...'
                  rows={3}
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                />
              </Grid>

              {isEdit && (
                <Grid item xs={12}>
                  <GlobalSelect
                    label='Status'
                    value={formData.status === 1 ? 'Active' : 'Inactive'}
                    onChange={e => handleChange('status', e.target.value === 'Active' ? 1 : 0)}
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' }
                    ]}
                  />
                </Grid>
              )}
            </Grid>

            <Box mt={4} display='flex' gap={2}>
              <GlobalButton type='submit' fullWidth>
                {isEdit ? 'Update' : 'Save'}
              </GlobalButton>
              <GlobalButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
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
            <strong style={{ color: '#d32f2f' }}>{deleteDialog.row?.name || 'this engine type'}</strong>?
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
