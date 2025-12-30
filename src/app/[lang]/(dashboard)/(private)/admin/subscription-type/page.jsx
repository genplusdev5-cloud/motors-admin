'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Box,
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
  FormControl
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'

import GlobalTextField from '@/components/common/GlobalTextField'
import GlobalTextarea from '@/components/common/GlobalTextarea'
import GlobalSelect from '@/components/common/GlobalSelect'
import GlobalButton from '@/components/common/GlobalButton'
import PrintIcon from '@mui/icons-material/Print'
import TableChartIcon from '@mui/icons-material/TableChart'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'

import {
  subscriptionTypeListApi,
  subscriptionTypeAddApi,
  subscriptionTypeUpdateApi,
  subscriptionTypeDeleteApi
} from '@/api/subscription-type'

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'
import { showToast } from '@/components/common/Toasts'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// Debounced Search
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value])
  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default function SubscriptionTypePage() {
  const [rows, setRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [exportAnchorEl, setExportAnchorEl] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, row: null })

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    color: '',
    days: '',
    icon: '',
    status: 1
  })

  const nameRef = useRef(null)

  // Load Data
  const loadData = async () => {
    setLoading(true)
    try {
      const res = await subscriptionTypeListApi()

      const normalized = res?.data?.map((item, i) => ({
        sno: i + 1,
        ...item
      }))

      setRows(normalized)
    } catch (err) {
      showToast('error', 'Failed to load subscription types')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Drawer Controls
  const handleAdd = () => {
    setIsEdit(false)
    setFormData({ id: null, name: '', description: '', status: 1 })
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.querySelector('input')?.focus(), 100)
  }

  const handleEdit = row => {
    setIsEdit(true)
    setFormData({
      id: row.id,
      name: row.name,
      description: row.description,
      color: row.color,
      days: row.days,
      icon: row.icon,
      status: row.is_active
    })
    setDrawerOpen(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showToast('warning', 'Name is required')
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        days: Number(formData.days),
        icon: formData.icon,
        is_active: Number(formData.status)
      }

      if (isEdit) {
        await subscriptionTypeUpdateApi(formData.id, payload)
        showToast('success', 'Subscription type updated')
      } else {
        await subscriptionTypeAddApi(payload)
        showToast('success', 'Subscription type added')
      }

      setDrawerOpen(false)
      loadData()
    } catch (err) {
      showToast('error', err?.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    try {
      await subscriptionTypeDeleteApi(deleteDialog.row.id)

      showToast('success', `${deleteDialog.row.name} deleted`)
      loadData()
    } catch (err) {
      showToast('error', 'Delete failed')
    } finally {
      setDeleteDialog({ open: false, row: null })
    }
  }

  // Filter & Pagination
  const filteredRows = useMemo(() => {
    if (!searchText) return rows
    return rows.filter(
      r =>
        r.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchText.toLowerCase()))
    )
  }, [rows, searchText])

  const paginatedRows = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination])

  // Table Columns
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
    columnHelper.accessor('name', { header: 'Subscription Type' }),
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
    })
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

  // Export Functions
  const exportCSV = () => {
    const csv = [
      ['S.No', 'Name', 'Description', 'Status'].join(','),
      ...rows.map(r => [r.sno, r.name, r.description || '', r.is_active ? 'Active' : 'Inactive'].join(','))
    ].join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = 'Subscription_Types.csv'
    link.click()
    showToast('success', 'CSV downloaded')
  }

  const exportCopy = () => {
    const text = rows
      .map(r => `${r.sno}. ${r.name} | ${r.description || '-'} | ${r.is_active ? 'Active' : 'Inactive'}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    showToast('info', 'Copied to clipboard')
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
        <Link href='/'>Home</Link>
        <Typography color='text.primary'>Subscription Type</Typography>
      </Breadcrumbs>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                Subscription Type
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
                onClick={loadData}
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
                Add Subscription Type
              </GlobalButton>
            </Box>
          }
          sx={{ pb: 1.5, pt: 1.5, '& .MuiCardHeader-action': { m: 0, alignItems: 'center' } }}
        />

        <Divider sx={{ mb: 2 }} />

        {/* Search + Entries */}
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
            placeholder='Search subscription types...'
            variant='outlined'
            size='small'
            sx={{ width: 300 }}
          />
        </Box>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center py-8'>
                    {searchText ? 'No results found' : 'No subscription types'}
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

      {/* Add/Edit Drawer */}
      <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 420 } }}>
        <Box sx={{ p: 5 }}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>{isEdit ? 'Edit Subscription Type' : 'Add Subscription Type'}</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <GlobalTextField
                  label='Name'
                  value={formData.name}
                  required
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  sx={{
                    '& .MuiFormLabel-asterisk': {
                      color: '#e91e63 !important',
                      fontWeight: 700
                    },
                    '& .MuiInputLabel-root.Mui-required': {
                      color: 'inherit'
                    }
                  }}
                  inputRef={nameRef}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <GlobalTextarea
                  label='Description'
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>

            <Box mt={4} display='flex' gap={2}>
              <GlobalButton type='submit' fullWidth loading={loading}>
                {isEdit ? 'Update' : 'Save'}
              </GlobalButton>
              <GlobalButton variant='outlined' color='secondary' fullWidth onClick={() => setDrawerOpen(false)}>
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
        PaperProps={{ sx: { overflow: 'visible', width: 440, borderRadius: 2, textAlign: 'center' } }}
      >
        <DialogTitle sx={{ color: 'error.main', fontWeight: 700, pb: 1, position: 'relative' }}>
          <WarningAmberIcon color='error' sx={{ fontSize: 28, mr: 1 }} />
          Confirm Delete
          <DialogCloseButton onClick={() => setDeleteDialog({ open: false, row: null })}>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent sx={{ px: 5, pt: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>
            Are you sure you want to delete <strong style={{ color: '#d32f2f' }}>{deleteDialog.row?.name}</strong>?
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <GlobalButton
            variant='outlined'
            color='secondary'
            onClick={() => setDeleteDialog({ open: false, row: null })}
          >
            Cancel
          </GlobalButton>
          <GlobalButton variant='contained' color='error' onClick={confirmDelete}>
            Delete
          </GlobalButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
