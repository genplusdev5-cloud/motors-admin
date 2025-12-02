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
  MenuItem as MuiMenuItem,
  CircularProgress,
  Avatar,
  List,
  ListItem
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

import { useDropzone } from 'react-dropzone'

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

// API (you provided these functions earlier)
import { getBannerTypeList, addBannerType, updateBannerType, deleteBannerType } from '@/api/bannerType'

// Re-usable local components (if you have them in your project you can keep these imports)
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import GlobalButton from '@/components/common/GlobalButton'
import GlobalTextField from '@/components/common/GlobalTextField'
import GlobalTextarea from '@/components/common/GlobalTextarea'
import GlobalSelect from '@/components/common/GlobalSelect'

// ------------------------- Dropzone Uploader (single image) -------------------------
const SingleImageUploader = ({ file, setFile, previewWidth = 120 }) => {
  const onDrop = acceptedFiles => {
    if (!acceptedFiles || acceptedFiles.length === 0) return
    const f = acceptedFiles[0]
    setFile(Object.assign(f))
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    onDropRejected: () => {
      showToast('info', 'Please upload a single image (max 5 MB).')
    }
  })

  const removeFile = () => setFile(null)

  return (
    <div>
      <div
        {...getRootProps({ className: 'dropzone' })}
        style={{
          border: '1px dashed rgba(0,0,0,0.12)',
          padding: 12,
          borderRadius: 6,
          cursor: 'pointer',
          textAlign: 'center'
        }}
      >
        <input {...getInputProps()} />
        <Avatar variant='rounded' sx={{ mx: 'auto', mb: 1 }}>
          <i className='tabler-cloud-upload' />
        </Avatar>
        <Typography variant='body2'>Drop image here, or click to select</Typography>
        <Typography variant='caption'>Allowed: png, jpg, jpeg, gif (max 5 MB)</Typography>
      </div>

      {file && (
        <List sx={{ mt: 2 }}>
          <ListItem sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: previewWidth, height: 'auto' }} />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{file.name}</Typography>
                <Typography variant='body2'>{Math.round(file.size / 1024)} KB</Typography>
              </Box>
            </Box>

            <Box>
              <Button variant='outlined' color='error' onClick={removeFile} size='small'>
                Remove
              </Button>
            </Box>
          </ListItem>
        </List>
      )}
    </div>
  )
}

// ------------------------- Main Component -------------------------
export default function BannerTypePage() {
  const theme = useTheme()

  // data
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })

  // drawer form state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [formData, setFormData] = useState({ id: null, name: '', description: '', is_active: 1 })
  const [imageFile, setImageFile] = useState(null)
  const nameRef = useRef(null)

  // delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, row: null })
  const [deleteLoading, setDeleteLoading] = useState(false)

  // export menu
  const [exportAnchorEl, setExportAnchorEl] = useState(null)

  // robust parse for list api output
  const parseBannerList = payload => {
    // payload could be:
    // - an array
    // - { status, message, data: [...] }
    // - { data: [...] }
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload.data)) return payload.data
    if (Array.isArray(payload.result)) return payload.result
    // older endpoints might nest further
    if (Array.isArray(payload.data?.data)) return payload.data.data
    return []
  }

  // fetch list
  const loadBannerTypes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getBannerTypeList() // this returns res.data per your helper
      const list = parseBannerList(res)
      if (!Array.isArray(list)) {
        showToast('error', 'Invalid response from server')
        setRows([])
        return
      }

      const normalized = list.map((item, i) => ({
        sno: i + 1,
        id: item.id,
        name: item.name,
        description: item.description || '',
        image: item.image || '',
        is_active: item.is_active ?? 1
      }))

      setRows(normalized)
    } catch (err) {
      console.error('LOAD BANNER TYPES ERROR', err)
      showToast('error', err?.message || 'Failed to load banner types')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBannerTypes()
  }, [loadBannerTypes])

  // open drawer add
  const handleAdd = () => {
    setIsEdit(false)
    setFormData({ id: null, name: '', description: '', is_active: 1 })
    setImageFile(null)
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 120)
  }

  // open drawer edit
  const handleEdit = row => {
    setIsEdit(true)
    setFormData({ id: row.id, name: row.name, description: row.description, is_active: row.is_active })
    setImageFile(null) // user can upload new image if they want
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 120)
  }

  const handleFieldChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleCancel = () => {
    setFormData({ id: null, name: '', description: '', is_active: 1 })
    setImageFile(null)
    setDrawerOpen(false)
  }

  // Submit (add / update)
  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.name.trim()) {
      showToast('warning', 'Name is required')
      return
    }

    // frontend duplicate check
    const exists = rows.find(
      r => r.name?.trim().toLowerCase() === formData.name.trim().toLowerCase() && r.id !== formData.id
    )
    if (exists) {
      showToast('warning', 'Banner type with this name already exists')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', formData.name.trim())
      fd.append('description', formData.description || '')
      fd.append('is_active', Number(formData.is_active))

      if (imageFile) fd.append('image', imageFile)

      let res
      // call your API helpers (they return res.data)
      if (isEdit && formData.id) {
        // many backends accept PATCH for file update; your helper uses PUT but keep using your helper
        res = await updateBannerType(formData.id, fd)
      } else {
        res = await addBannerType(fd)
      }

      // success
      showToast('success', isEdit ? 'Banner type updated' : 'Banner type added')
      setDrawerOpen(false)
      await loadBannerTypes()
    } catch (err) {
      console.error('SAVE BANNER TYPE ERROR', err)
      // backend error object may be nested
      const errMsg = (err && (err.message || err.detail || err?.data?.message)) || 'Failed to save banner type'
      showToast('error', errMsg)
    } finally {
      setLoading(false)
    }
  }

  // delete
  const confirmDelete = async () => {
    if (!deleteDialog.row) return
    setDeleteLoading(true)
    try {
      await deleteBannerType(deleteDialog.row.id)
      showToast('delete', `${deleteDialog.row.name} deleted`)
      await loadBannerTypes()
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
      <html><head><title>Banner Type List</title><style>
        body{font-family:Arial;padding:24px;}
        table{width:100%;border-collapse:collapse;}
        th,td{border:1px solid #ccc;padding:8px;text-align:left;}
        th{background:#f4f4f4;}
      </style></head><body>
      <h2>Banner Type List</h2>
      <table><thead><tr>
        <th>S.No</th><th>Name</th><th>Description</th><th>Status</th>
      </tr></thead><tbody>
      ${rows.map(r => `<tr><td>${r.sno}</td><td>${r.name}</td><td>${r.description || '-'}</td><td>${r.is_active == 1 ? 'Active' : 'Inactive'}</td></tr>`).join('')}
      </tbody></table></body></html>`
    w?.document.write(html)
    w?.document.close()
    w?.print()
  }

  const exportCSV = () => {
    const headers = ['S.No', 'Name', 'Description', 'Status']
    const csv = [
      headers.join(','),
      ...rows.map(r =>
        [
          r.sno,
          `"${(r.name || '').replace(/"/g, '""')}"`,
          `"${(r.description || '-').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`,
          r.is_active == 1 ? 'Active' : 'Inactive'
        ].join(',')
      )
    ].join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = 'BannerType_List.csv'
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
        Description: r.description || '-',
        Status: r.is_active == 1 ? 'Active' : 'Inactive'
      }))
    )
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'BannerTypes')
    writeFile(wb, 'BannerType_List.xlsx')
    showToast('success', 'Excel downloaded')
  }

  const exportPDF = async () => {
    if (typeof window === 'undefined') return
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()
    doc.text('Banner Type List', 14, 15)
    autoTable(doc, {
      startY: 25,
      head: [['S.No', 'Name', 'Description', 'Status']],
      body: rows.map(r => [r.sno, r.name, r.description || '-', r.is_active == 1 ? 'Active' : 'Inactive'])
    })
    doc.save('BannerType_List.pdf')
    showToast('success', 'PDF exported')
  }

  const exportCopy = () => {
    const text = rows
      .map(r => `${r.sno}. ${r.name} | ${r.description || '-'} | ${r.is_active == 1 ? 'Active' : 'Inactive'}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    showToast('info', 'Copied to clipboard')
  }

  // Table setup
  const filteredRows = useMemo(() => {
    if (!searchText) return rows
    const q = searchText.toLowerCase()
    return rows.filter(r => (r.name || '').toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q))
  }, [rows, searchText])

  const paginatedRows = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination])

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
              <i className='tabler-edit' style={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size='small'
              color='error'
              onClick={() => setDeleteDialog({ open: true, row: info.row.original })}
            >
              <i className='tabler-trash' style={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )
      }),
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('description', { header: 'Description' }),
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
    []
  )

  const table = useReactTable({
    data: paginatedRows,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(filteredRows.length / pagination.pageSize) || 1,
    state: { globalFilter: searchText, pagination },
    onGlobalFilterChange: setSearchText,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link href='/' style={{ textDecoration: 'none' }}>
            Home
          </Link>
          <Typography color='text.primary'>Banner Type</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                Banner Type Management
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
                onClick={loadBannerTypes}
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
                Add Banner Type
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
                  <MuiMenuItem key={v} value={v}>
                    {v} entries
                  </MuiMenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            size='small'
            placeholder='Search banner type...'
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
              ) : paginatedRows.length === 0 ? (
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
          totalCount={filteredRows.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      </Card>

      {/* Drawer for Add/Edit */}
      <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 420 } }}>
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
            <Typography variant='h5' fontWeight={600}>
              {isEdit ? 'Edit Banner Type' : 'Add Banner Type'}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <GlobalTextField
                  label='Name *'
                  placeholder='Enter banner type name'
                  value={formData.name}
                  inputRef={nameRef}
                  required
                  onChange={e => handleFieldChange('name', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <SingleImageUploader file={imageFile} setFile={setImageFile} previewWidth={160} />
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

      {/* Delete Dialog */}
      <Dialog
        onClose={() => setDeleteDialog({ open: false, row: null })}
        aria-labelledby='customized-dialog-title'
        open={deleteDialog.open}
        closeAfterTransition={false}
        PaperProps={{
          sx: {
            overflow: 'visible',
            width: 420,
            borderRadius: 1,
            textAlign: 'center'
          }
        }}
      >
        {/* 🔴 Title with Warning Icon */}
        <DialogTitle
          id='customized-dialog-title'
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
          {/* ❌ Close Button */}
          <DialogCloseButton onClick={() => setDeleteDialog({ open: false, row: null })} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>

        {/* Centered text */}
        <DialogContent sx={{ px: 5, pt: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: '#d32f2f' }}>{deleteDialog.row?.name || 'this category'}</strong>
            ?
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>

        {/* Centered Buttons */}
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, pt: 2 }}>
          <GlobalButton
            variant='outlined'
            color='secondary'
            onClick={() => setDeleteDialog({ open: false, row: null })}
          >
            Cancel
          </GlobalButton>

          <GlobalButton
            variant='contained'
            color='error'
            onClick={confirmDelete}
            disabled={deleteLoading} // 🔥 disable during delete
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </GlobalButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
