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
  FormControl
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

import classnames from 'classnames'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'
import ChevronRight from '@menu/svg/ChevronRight'

// Debounced input
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value])
  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

export default function GaragePage() {
  const ENTITY = 'Garage'

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
    name: '',
    description: '',
    status: 1
  })

  const nameRef = useRef(null)

  const loadList = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      showToast('info', `${ENTITY} refreshed (UI only)`)
    }, 400)
  }

  useEffect(() => {
    loadList()
  }, [])

  const toggleDrawer = () => setDrawerOpen(p => !p)

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

  const handleFieldChange = (f, v) => setFormData(p => ({ ...p, [f]: v }))

  const handleCancel = () => setDrawerOpen(false)

  const handleSubmit = e => {
    e.preventDefault()

    if (!formData.name.trim()) return showToast('warning', `${ENTITY} name required`)

    setLoading(true)
    try {
      if (isEdit) {
        setRows(prev =>
          prev.map(r =>
            r.id === formData.id
              ? {
                  ...r,
                  name: formData.name.trim(),
                  description: formData.description?.trim() || '',
                  is_active: formData.status
                }
              : r
          )
        )
        showToast('success', `${ENTITY} updated (UI only)`)
      } else {
        const newId = Date.now()
        setRows(prev => [
          ...prev,
          {
            sno: prev.length + 1,
            id: newId,
            name: formData.name.trim(),
            description: formData.description?.trim() || '',
            is_active: formData.status
          }
        ])
        showToast('success', `${ENTITY} added (UI only)`)
      }
      setDrawerOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = () => {
    if (!deleteDialog.row) return
    setDeleteLoading(true)
    try {
      setRows(prev =>
        prev
          .filter(r => r.id !== deleteDialog.row.id)
          .map((r, i) => ({ ...r, sno: i + 1 }))
      )
      showToast('delete', `${deleteDialog.row.name} deleted (UI only)`)
    } finally {
      setDeleteLoading(false)
      setDeleteDialog({ open: false, row: null })
    }
  }

  const columnHelper = createColumnHelper()
  const columns = useMemo(
    () => [
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
      columnHelper.accessor('name', { header: `${ENTITY} Name` }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: info => info.getValue() || '-'
      }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: info => (
          <Chip
            label={info.getValue() == 1 ? 'Active' : 'Inactive'}
            size='small'
            sx={{
              color: '#fff',
              bgcolor: info.getValue() == 1 ? 'success.main' : 'error.main'
            }}
          />
        )
      })
    ],
    []
  )

  const filteredRows = useMemo(() => {
    if (!searchText) return rows
    return rows.filter(
      r =>
        r.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchText.toLowerCase())
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

              <Menu anchorEl={exportAnchorEl} open={exportOpen} onClose={() => setExportAnchorEl(null)}>
                <MenuItem onClick={exportAction}>Print</MenuItem>
                <MenuItem onClick={exportAction}>CSV</MenuItem>
                <MenuItem onClick={exportAction}>Excel</MenuItem>
                <MenuItem onClick={exportAction}>PDF</MenuItem>
                <MenuItem onClick={exportAction}>Copy</MenuItem>
              </Menu>

              <GlobalButton startIcon={<AddIcon />} onClick={handleAdd}>
                Add {ENTITY}
              </GlobalButton>
            </Box>
          }
        />

        <Divider sx={{ mb: 2 }} />

        {/* Search Controls */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box display='flex' alignItems='center' gap={1}>
            <Typography>Show</Typography>
            <FormControl size='small'>
              <Select
                value={pagination.pageSize}
                onChange={e =>
                  setPagination(p => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))
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
            placeholder='Search garage...'
            variant='outlined'
            size='small'
            sx={{ width: 360 }}
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
                    No data available
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
      <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer} PaperProps={{ sx: { width: 420 } }}>
        <Box sx={{ p: 4 }}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h5'>{isEdit ? `Edit ${ENTITY}` : `Add ${ENTITY}`}</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <GlobalTextField
                  label={`${ENTITY} Name *`}
                  placeholder={`Enter ${ENTITY.toLowerCase()} name`}
                  value={formData.name}
                  required
                  inputRef={nameRef}
                  onChange={e => handleFieldChange('name', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <GlobalTextarea
                  label='Description'
                  placeholder='Optional description...'
                  rows={3}
                  value={formData.description}
                  onChange={e => handleFieldChange('description', e.target.value)}
                />
              </Grid>

              {isEdit && (
                <Grid item xs={12}>
                  <GlobalSelect
                    label='Status'
                    value={formData.status === 1 ? 'Active' : 'Inactive'}
                    onChange={e => handleFieldChange('status', e.target.value === 'Active' ? 1 : 0)}
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
                {loading ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update' : 'Save'}
              </GlobalButton>
              <GlobalButton fullWidth variant='outlined' color='secondary' onClick={handleCancel}>
                Cancel
              </GlobalButton>
            </Box>
          </form>
        </Box>
      </Drawer>

      {/* Delete Prompt */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, row: null })}>
        <DialogTitle>
          <WarningAmberIcon color='error' /> Confirm Delete
          <DialogCloseButton onClick={() => setDeleteDialog({ open: false, row: null })} />
        </DialogTitle>
        <DialogContent>
          Are you sure want to delete <strong>{deleteDialog.row?.name}</strong> ?
        </DialogContent>
        <DialogActions>
          <GlobalButton variant='outlined' color='secondary' onClick={() => setDeleteDialog({ open: false, row: null })}>
            Cancel
          </GlobalButton>
          <GlobalButton color='error' onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </GlobalButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
