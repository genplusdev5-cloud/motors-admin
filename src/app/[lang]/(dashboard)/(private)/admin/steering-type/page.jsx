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

import { steeringList, steeringAdd, steeringUpdate, steeringDelete } from '@/api/steering'

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

// ─────────────────────────────────────────────────────────────
// Debounced Input
// ─────────────────────────────────────────────────────────────
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => setValue(initialValue), [initialValue])

  useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value, debounce, onChange])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// ─────────────────────────────────────────────────────────────
// Steering Type Page (UI-only, local state)
// ─────────────────────────────────────────────────────────────
export default function SteeringTypePage() {
  const ENTITY = 'Steering Type'

  const [rows, setRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, row: null })
  const [exportAnchorEl, setExportAnchorEl] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [unsavedAddData, setUnsavedAddData] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    status: 1,
    imageFile: null,
    imageUrl: ''
  })

  const nameRef = useRef(null)

  // ────────────────────────────── Load (UI only) ──────────────────────────────
  const loadItems = async () => {
    setLoading(true)
    try {
      const res = await steeringList()
      const list = res?.data?.data || []

      const formatted = list.map((item, index) => ({
        sno: index + 1,
        id: item.id,
        name: item.name,
        description: item.description || '',
        image: item.image,
        is_active: Number(item.is_active) // 🔥 convert to number always
      }))

      setRows(formatted)
    } catch {
      showToast('error', 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ────────────────────────────── Drawer & Form ──────────────────────────────
  const toggleDrawer = () => setDrawerOpen(p => !p)

  const handleAdd = () => {
    setIsEdit(false)
    if (unsavedAddData) {
      setFormData(unsavedAddData)
    } else {
      setFormData({
        id: null,
        name: '',
        description: '',
        status: 1,
        imageFile: null,
        imageUrl: ''
      })
      setPreviewUrl(null)
    }
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 100)
  }

  const handleEdit = row => {
    setIsEdit(true)
    setFormData({
      id: row.id,
      name: row.name,
      description: row.description,
      status: Number(row.is_active) // 🔥 always convert 1/0
    })
    setPreviewUrl(row.image || '')
    setDrawerOpen(true)
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      if (!isEdit) setUnsavedAddData(updated)
      return updated
    })
  }

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    setFormData(prev => {
      const updated = { ...prev, imageFile: file }
      if (!isEdit) setUnsavedAddData(updated)
      return updated
    })
  }

  const handleCancel = () => {
    setDrawerOpen(false)
    setFormData({
      id: null,
      name: '',
      description: '',
      status: 1,
      imageFile: null,
      imageUrl: ''
    })
    setPreviewUrl(null)
    setUnsavedAddData(null)
  }

  // ────────────────────────────── Submit (Add / Update) ──────────────────────────────
  // Build FormData for upload
  const buildFormData = () => {
    const fd = new FormData()
    fd.append('name', formData.name.trim())
    fd.append('description', formData.description || '')
    fd.append('is_active', Number(formData.status)) // 🔥 IMPORTANT
    if (formData.imageFile) fd.append('image', formData.imageFile)
    return fd
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showToast('warning', `${ENTITY} name is required`)
      return
    }

    try {
      setLoading(true)
      const apiForm = buildFormData()

      if (isEdit) {
        await steeringUpdate(formData.id, apiForm)
        showToast('success', `${ENTITY} updated`)
      } else {
        await steeringAdd(apiForm)
        showToast('success', `${ENTITY} added`)
      }

      await loadItems()
      handleCancel()
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  // ────────────────────────────── Delete ──────────────────────────────
  const confirmDelete = async () => {
    if (!deleteDialog.row) return

    setDeleteLoading(true) // 🔥 disable delete button while deleting

    try {
      const res = await steeringDelete(deleteDialog.row.id)

      if (res?.data?.status === 'success' || res?.data?.message?.toLowerCase()?.includes('success')) {
        showToast('delete', `${deleteDialog.row.name} deleted`)
        await loadItems() // 🔄 refresh data from DB
      } else {
        showToast('error', res?.data?.message || 'Delete failed')
      }
    } catch (err) {
      console.error('STEERING DELETE ERROR:', err)
      showToast('error', err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleteLoading(false)
      setDeleteDialog({ open: false, row: null }) // ❌ close dialog
    }
  }

  // ────────────────────────────── Table Columns ──────────────────────────────
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
      columnHelper.accessor('image', {
        header: 'Image',
        cell: info => {
          const img = info.getValue()
          return img ? (
            <img
              src={img}
              alt='steering-type'
              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4 }}
            />
          ) : (
            <Typography variant='caption' color='text.disabled'>
              -
            </Typography>
          )
        }
      }),
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
              bgcolor: info.getValue() == 1 ? 'success.main' : 'error.main', // 🔥 same as Category page
              fontWeight: 600,
              borderRadius: '6px',
              px: 1.5
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
    state: { globalFilter: searchText, pagination },
    onGlobalFilterChange: setSearchText,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  const exportOpen = Boolean(exportAnchorEl)

  // Export actions – only UI messages now
  const exportPrint = () => showToast('info', 'Print (UI only)')
  const exportCSV = () => showToast('info', 'CSV (UI only)')
  const exportExcel = () => showToast('info', 'Excel (UI only)')
  const exportPDF = () => showToast('info', 'PDF (UI only)')
  const exportCopy = () => showToast('info', 'Copy (UI only)')

  // ────────────────────────────── Render ──────────────────────────────
  return (
    <Box>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link href='/' className='text-primary'>
            Home
          </Link>
          <Link href='/masters' className='text-primary'>
            Masters
          </Link>
          <Typography color='text.primary'>{ENTITY}</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                {ENTITY}
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
                onClick={loadItems}
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

              <Menu anchorEl={exportAnchorEl} open={exportOpen} onClose={() => setExportAnchorEl(null)}>
                <MenuItem
                  onClick={() => {
                    exportPrint()
                    setExportAnchorEl(null)
                  }}
                >
                  Print
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportCSV()
                    setExportAnchorEl(null)
                  }}
                >
                  CSV
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportExcel()
                    setExportAnchorEl(null)
                  }}
                >
                  Excel
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportPDF()
                    setExportAnchorEl(null)
                  }}
                >
                  PDF
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    exportCopy()
                    setExportAnchorEl(null)
                  }}
                >
                  Copy
                </MenuItem>
              </Menu>

              <GlobalButton startIcon={<AddIcon />} onClick={handleAdd}>
                Add {ENTITY}
              </GlobalButton>
            </Box>
          }
          sx={{ pb: 1.5, pt: 1.5, '& .MuiCardHeader-action': { m: 0, alignItems: 'center' } }}
        />

        <Divider sx={{ mb: 2 }} />

        {/* Top controls */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              Show
            </Typography>
            <FormControl size='small' sx={{ width: 140 }}>
              <Select
                value={pagination.pageSize}
                onChange={e => setPagination(p => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))}
              >
                {[5, 10, 25, 50, 100].map(v => (
                  <MenuItem key={v} value={v}>
                    {v} entries
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <DebouncedInput
            value={searchText}
            onChange={v => setSearchText(String(v))}
            placeholder='Search steering type...'
            sx={{ width: 360 }}
            variant='outlined'
            size='small'
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
                      <div
                        className={classnames({
                          'flex items-center': h.column.getIsSorted(),
                          'cursor-pointer select-none': h.column.getCanSort()
                        })}
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {{
                          asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                          desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                        }[h.column.getIsSorted()] ?? null}
                      </div>
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

      {/* Drawer - Add/Edit */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { width: 420, boxShadow: '0px 0px 15px rgba(0,0,0,0.08)' } }}
      >
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
            <Typography variant='h5' fontWeight={600}>
              {isEdit ? `Edit ${ENTITY}` : `Add ${ENTITY}`}
            </Typography>
            <IconButton onClick={toggleDrawer} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <GlobalTextField
                  label={`${ENTITY} Name *`}
                  placeholder={`Enter ${ENTITY.toLowerCase()} name`}
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
                  rows={4}
                  value={formData.description}
                  onChange={e => handleFieldChange('description', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 1 }}>
                  Image
                </Typography>
                <Button variant='outlined' component='label' size='small' sx={{ textTransform: 'none', mb: 2 }}>
                  Choose Image
                  <input type='file' hidden accept='image/*' onChange={handleImageChange} />
                </Button>
                {previewUrl && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={previewUrl}
                      alt='Preview'
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'contain',
                        borderRadius: 4,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </Box>
                )}
              </Grid>

              {isEdit && (
                <Grid item xs={12}>
                  <GlobalSelect
                    label='Status'
                    value={formData.status == 1 ? 'Active' : 'Inactive'}
                    onChange={e => handleFieldChange('status', e.target.value === 'Active' ? 1 : 0)}
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' }
                    ]}
                  />
                </Grid>
              )}
            </Grid>

            <Box mt={4} display='flex' gap={2}>
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
            <strong style={{ color: '#d32f2f' }}>{deleteDialog.row?.name || `this ${ENTITY}`}</strong>?
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
