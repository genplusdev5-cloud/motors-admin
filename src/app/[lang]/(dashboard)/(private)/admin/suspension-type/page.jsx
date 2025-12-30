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

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import GlobalTextField from '@/components/common/GlobalTextField'
import GlobalTextarea from '@/components/common/GlobalTextarea'
import GlobalSelect from '@/components/common/GlobalSelect'
import GlobalButton from '@/components/common/GlobalButton'

import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'

import { toast } from 'react-toastify'
import { showToast } from '@/components/common/Toasts.jsx'

import TablePaginationComponent from '@/components/TablePaginationComponent'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'
import classnames from 'classnames'
import ChevronRight from '@menu/svg/ChevronRight'

// API Placeholder — later replace with your real API
const getSuspensionTypeList = async () => {
  return { data: [] } // ← FIX LATER
}
const addSuspensionType = async data => {}
const updateSuspensionType = async (id, data) => {}
const deleteSuspensionType = async id => {}

// =====================================================================
// Debounced Input
// =====================================================================
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value])
  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// =====================================================================
// Main Page Component
// =====================================================================
export default function SuspensionTypePage() {
  const entity = 'Suspension Type'

  const [rows, setRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, row: null })
  const [exportAnchorEl, setExportAnchorEl] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [fileURL, setFileURL] = useState(null)

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    status: 1,
    imageFile: null,
    imageUrl: ''
  })

  const nameRef = useRef(null)

  // =====================================================================
  // Load Data
  // =====================================================================
  const loadList = async () => {
    setLoading(true)
    try {
      const res = await getSuspensionTypeList()
      const list = res?.data || []
      const normalized = list.map((item, index) => ({
        sno: index + 1,
        id: item.id,
        name: item.name ?? '',
        description: item.description ?? '',
        image: item.image ?? '',
        is_active: item.is_active ?? 1
      }))
      setRows(normalized)
    } catch {
      showToast('error', `Failed to load ${entity}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadList()
  }, [])

  // =====================================================================
  // Drawer + Form Actions
  // =====================================================================
  const toggleDrawer = () => setDrawerOpen(p => !p)

  const handleAdd = () => {
    setIsEdit(false)
    setFormData({
      id: null,
      name: '',
      description: '',
      status: 1,
      imageFile: null,
      imageUrl: ''
    })
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 100)
  }

  const handleEdit = row => {
    setIsEdit(true)
    setFormData({
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.is_active,
      imageFile: null,
      imageUrl: row.image
    })
    setDrawerOpen(true)
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setFormData(prev => ({ ...prev, imageFile: file }))
    setFileURL(URL.createObjectURL(file))
  }

  const handleCancel = () => {
    setDrawerOpen(false)
  }

  // =====================================================================
  // Submit (Add / Update)
  // =====================================================================
  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showToast('warning', `${entity} name is required`)
      return
    }

    setLoading(true)
    try {
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('description', formData.description)
      payload.append('is_active', String(formData.status))
      if (formData.imageFile) payload.append('image', formData.imageFile)

      if (isEdit) {
        await updateSuspensionType(formData.id, payload)
        showToast('success', `${entity} updated`)
      } else {
        await addSuspensionType(payload)
        showToast('success', `${entity} added`)
      }

      setDrawerOpen(false)
      await loadList()
    } catch {
      showToast('error', `Failed to save ${entity}`)
    } finally {
      setLoading(false)
    }
  }

  // =====================================================================
  // Delete
  // =====================================================================
  const confirmDelete = async () => {
    if (!deleteDialog.row) return
    setDeleteLoading(true)
    try {
      await deleteSuspensionType(deleteDialog.row.id)
      showToast('delete', `${deleteDialog.row.name} deleted`)
      await loadList()
    } catch {
      showToast('error', `Delete failed`)
    } finally {
      setDeleteLoading(false)
      setDeleteDialog({ open: false, row: null })
    }
  }

  // =====================================================================
  // Table Columns
  // =====================================================================
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
              <EditIcon fontSize='small' />
            </IconButton>
            <IconButton
              size='small'
              color='error'
              onClick={() => setDeleteDialog({ open: true, row: info.row.original })}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Box>
        )
      }),
      columnHelper.accessor('name', { header: `${entity} Name` }),
      columnHelper.accessor('image', {
        header: 'Image',
        cell: info =>
          info.getValue() ? (
            <img src={info.getValue()} alt='img' width={40} height={40} style={{ borderRadius: 6 }} />
          ) : (
            '-'
          )
      }),
      columnHelper.accessor('description', { header: 'Description', cell: i => i.getValue() || '-' }),
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
    state: {
      pagination,
      globalFilter: searchText
    },
    manualPagination: true,
    pageCount: Math.ceil(filteredRows.length / pagination.pageSize),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchText,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  const exportOpen = Boolean(exportAnchorEl)

  // =====================================================================
  // Render UI
  // =====================================================================
  return (
    <Box>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs>
          <Link href='/'>Home</Link>
          <Link href='/masters'>Masters</Link>
          <Typography>{entity}</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h5'>{entity}</Typography>
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
                <MenuItem onClick={() => setExportAnchorEl(null)}>Print</MenuItem>
                <MenuItem onClick={() => setExportAnchorEl(null)}>CSV</MenuItem>
                <MenuItem onClick={() => setExportAnchorEl(null)}>Excel</MenuItem>
                <MenuItem onClick={() => setExportAnchorEl(null)}>PDF</MenuItem>
                <MenuItem onClick={() => setExportAnchorEl(null)}>Copy</MenuItem>
              </Menu>

              <GlobalButton startIcon={<AddIcon />} onClick={handleAdd}>
                Add {entity}
              </GlobalButton>
            </Box>
          }
        />

        <Divider sx={{ mb: 2 }} />

        {/* Search + Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box display='flex' alignItems='center' gap={2}>
            <Typography>Show</Typography>
            <FormControl size='small' sx={{ width: 120 }}>
              <Select
                value={pagination.pageSize}
                onChange={e => setPagination(p => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))}
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
            placeholder={`Search ${entity.toLowerCase()}...`}
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
                    <th key={h.id} onClick={h.column.getToggleSortingHandler()}>
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

      {/* Drawer */}
      <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer} PaperProps={{ sx: { width: 420 } }}>
        <Box sx={{ p: 4 }}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h5'>{isEdit ? `Edit ${entity}` : `Add ${entity}`}</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <GlobalTextField
                  label={`${entity} Name *`}
                  placeholder={`Enter ${entity.toLowerCase()} name`}
                  value={formData.name}
                  inputRef={nameRef}
                  required
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

              <Grid item xs={12}>
                <Typography variant='subtitle2'>Image</Typography>
                <Button variant='outlined' component='label' size='small'>
                  Choose Image
                  <input type='file' hidden accept='image/*' onChange={handleImageChange} />
                </Button>

                {(fileURL || formData.imageUrl) && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={fileURL || formData.imageUrl}
                      width={80}
                      height={80}
                      style={{ borderRadius: 6, border: '1px solid #eee' }}
                    />
                  </Box>
                )}
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

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, row: null })}
        PaperProps={{ sx: { width: 400, borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <WarningAmberIcon />
          Confirm Delete
          <DialogCloseButton onClick={() => setDeleteDialog({ open: false, row: null })} />
        </DialogTitle>

        <DialogContent>
          Are you sure want to delete
          <strong> {deleteDialog.row?.name}</strong> ?
        </DialogContent>

        <DialogActions sx={{ pb: 2 }}>
          <GlobalButton variant='outlined' onClick={() => setDeleteDialog({ open: false, row: null })}>
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
