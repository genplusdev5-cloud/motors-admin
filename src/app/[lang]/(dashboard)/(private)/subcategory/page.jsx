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
  Select,
  FormControl
} from '@mui/material'

import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import PrintIcon from '@mui/icons-material/Print'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import TableChartIcon from '@mui/icons-material/TableChart'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'
import GlobalAutocomplete from '@/components/common/GlobalAutocomplete'

import GlobalTextField from '@/components/common/GlobalTextField'
import GlobalTextarea from '@/components/common/GlobalTextarea'
import GlobalSelect from '@/components/common/GlobalSelect'
import GlobalButton from '@/components/common/GlobalButton'

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

import { showToast } from '@/components/common/Toasts'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// 🔥 API imports
import { getSubCategoryList, addSubCategory, updateSubCategory, deleteSubCategory } from '@/api/subcategory'
import { getCategoryList } from '@/api/category'

// ────────────────────────────── Debounced Input ──────────────────────────────
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => setValue(initialValue), [initialValue])

  useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value, debounce, onChange])

  return <GlobalTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const columnHelper = createColumnHelper()

// ────────────────────────────── Main Component ──────────────────────────────
export default function SubCategoryPage() {
  const [rows, setRows] = useState([])
  const [rowCount, setRowCount] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, row: null })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [exportAnchorEl, setExportAnchorEl] = useState(null)
  const [unsavedAddData, setUnsavedAddData] = useState(null)

  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    id: null,
    categoryId: '',
    name: '',
    description: '',
    status: 1
  })

  const nameRef = useRef(null)

  const loadCategories = async () => {
    try {
      const res = await getCategoryList()

      // Correct response mapping
      const list = res?.data?.data || []

      const options = list.map(item => ({
        value: item.id,
        label: item.name
      }))

      setCategories(options)
    } catch (err) {
      console.error('CATEGORY DROPDOWN ERROR:', err.response?.data || err.message)
      showToast('error', 'Failed to load categories')
    }
  }

  // ────────────────────────────── Load SubCategories ──────────────────────────────
  const loadSubCategories = async () => {
    setLoading(true)
    try {
      const res = await getSubCategoryList()
      console.log('SUBCATEGORY LIST RESPONSE:', res)

      const data = res?.data?.results || res?.results || res?.data || []

      if (!Array.isArray(data)) {
        showToast('error', 'Invalid response format')
        return
      }

      const normalized = data.map((item, index) => ({
        sno: index + 1,
        id: item.id,
        categoryId: item.category_id,
        categoryName: item.category_name ?? '-',
        name: item.name ?? '',
        description: item.description ?? '',
        is_active: item.is_active ?? 1
      }))

      setRows(normalized)
      setRowCount(normalized.length)
    } catch (err) {
      console.error('SUBCATEGORY LIST ERROR:', err.response?.data || err.message)
      showToast('error', err.response?.data?.message || 'Failed to load subcategories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
    loadSubCategories()
  }, [])

  // ────────────────────────────── Drawer & Form Handlers ──────────────────────────────
  const toggleDrawer = () => setDrawerOpen(prev => !prev)

  const handleAdd = () => {
    setIsEdit(false)
    if (unsavedAddData) {
      setFormData(unsavedAddData)
    } else {
      setFormData({
        id: null,
        categoryId: '',
        name: '',
        description: '',
        status: 1
      })
    }
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.focus(), 100)
  }

  const handleEdit = row => {
    setIsEdit(true)
    setFormData({
      id: row.id,
      categoryId: row.categoryId,
      name: row.name,
      description: row.description,
      status: row.is_active
    })
    setDrawerOpen(true)
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      if (!isEdit) setUnsavedAddData(updated)
      return updated
    })
  }

  const handleCancel = () => {
    setFormData({ id: null, categoryId: '', name: '', description: '', status: 1 })
    setUnsavedAddData(null)
    setDrawerOpen(false)
  }

  // ────────────────────────────── Submit (Add / Update) ──────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.categoryId) {
      showToast('warning', 'Category is required')
      return
    }

    if (!formData.name.trim()) {
      showToast('warning', 'SubCategory name is required')
      return
    }

    // Duplicate check on name under same category
    if (!isEdit) {
      const exists = rows.some(
        r =>
          r.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
          String(r.categoryId) === String(formData.categoryId)
      )
      if (exists) {
        showToast('warning', 'SubCategory with this name already exists in this category')
        return
      }
    }

    setLoading(true)
    try {
      const payload = {
        category_id: Number(formData.categoryId),
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        is_active: Number(formData.status)
      }

      let res
      if (isEdit) {
        res = await updateSubCategory(formData.id, payload)
      } else {
        res = await addSubCategory(payload)
      }

      if (res.status === 'success' || res.message?.toLowerCase().includes('success')) {
        showToast('success', isEdit ? 'SubCategory updated' : 'SubCategory added')
        setUnsavedAddData(null)
        setDrawerOpen(false)
        await loadSubCategories()
      } else {
        showToast('error', res.message || 'Operation failed')
      }
    } catch (err) {
      console.error('SUBCATEGORY SAVE ERROR:', err.response?.data || err)
      showToast('error', err.response?.data?.message || 'Failed to save subcategory')
    } finally {
      setLoading(false)
    }
  }

  // ────────────────────────────── Delete ──────────────────────────────
  const confirmDelete = async () => {
    if (!deleteDialog.row) return

    setDeleteLoading(true)
    try {
      const res = await deleteSubCategory(deleteDialog.row.id)

      if (res.status === 'success' || res.message?.toLowerCase().includes('success')) {
        showToast('delete', `${deleteDialog.row.name} deleted`)
        await loadSubCategories()
      } else {
        showToast('error', res.message || 'Delete failed')
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Delete failed')
    } finally {
      setDeleteLoading(false)
      setDeleteDialog({ open: false, row: null })
    }
  }

  // ────────────────────────────── Table Logic ──────────────────────────────
  const filteredRows = useMemo(() => {
    if (!searchText) return rows
    const q = searchText.toLowerCase()
    return rows.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.categoryName || '').toLowerCase().includes(q)
    )
  }, [rows, searchText])

  const paginatedRows = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination])

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
      columnHelper.accessor('categoryName', { header: 'Category' }),
      columnHelper.accessor('name', { header: 'SubCategory Name' }),
      columnHelper.accessor('description', { header: 'Description' }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: info => {
          const value = info.getValue()
          const active = value === 1 || value === true
          return (
            <Chip
              label={active ? 'Active' : 'Inactive'}
              size='small'
              sx={{
                color: '#fff',
                bgcolor: active ? 'success.main' : 'error.main',
                fontWeight: 600,
                borderRadius: '6px',
                px: 1.5
              }}
            />
          )
        }
      })
    ],
    []
  )

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

  // ────────────────────────────── Export Helpers ──────────────────────────────
  const exportPrint = () => {
    const w = window.open('', '_blank')
    const html = `
      <html><head><title>SubCategory List</title><style>
        body{font-family:Arial;padding:24px;}
        table{width:100%;border-collapse:collapse;}
        th,td{border:1px solid #ccc;padding:8px;text-align:left;}
        th{background:#f4f4f4;}
      </style></head><body>
      <h2>SubCategory List</h2>
      <table><thead><tr>
        <th>S.No</th><th>Category</th><th>SubCategory Name</th><th>Description</th><th>Status</th>
      </tr></thead><tbody>
      ${rows
        .map(
          r =>
            `<tr><td>${r.sno}</td><td>${r.categoryName}</td><td>${r.name}</td><td>${r.description}</td><td>${
              r.is_active == 1 ? 'Active' : 'Inactive'
            }</td></tr>`
        )
        .join('')}
      </tbody></table></body></html>`
    w?.document.write(html)
    w?.document.close()
    w?.print()
  }

  const exportCSV = () => {
    const headers = ['S.No', 'Category', 'SubCategory Name', 'Description', 'Status']
    const csv = [
      headers.join(','),
      ...rows.map(r =>
        [r.sno, r.categoryName, r.name, r.description, r.is_active == 1 ? 'Active' : 'Inactive'].join(',')
      )
    ].join('\n')
    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = 'SubCategory_List.csv'
    link.click()
    showToast('success', 'CSV downloaded')
  }

  const exportExcel = async () => {
    if (typeof window === 'undefined') return
    const { utils, writeFile } = await import('xlsx')
    const ws = utils.json_to_sheet(
      rows.map(r => ({
        'S.No': r.sno,
        Category: r.categoryName,
        'SubCategory Name': r.name,
        Description: r.description || '-',
        Status: r.is_active == 1 ? 'Active' : 'Inactive'
      }))
    )
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'SubCategories')
    writeFile(wb, 'SubCategory_List.xlsx')
    showToast('success', 'Excel downloaded')
  }

  const exportPDF = async () => {
    if (typeof window === 'undefined') return
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()
    doc.text('SubCategory List', 14, 15)
    autoTable(doc, {
      startY: 25,
      head: [['S.No', 'Category', 'SubCategory Name', 'Description', 'Status']],
      body: rows.map(r => [
        r.sno,
        r.categoryName,
        r.name,
        r.description || '-',
        r.is_active == 1 ? 'Active' : 'Inactive'
      ])
    })
    doc.save('SubCategory_List.pdf')
    showToast('success', 'PDF exported')
  }

  const exportCopy = () => {
    const text = rows
      .map(
        r =>
          `${r.sno}. [${r.categoryName}] ${r.name} | ${r.description || '-'} | ${
            r.is_active == 1 ? 'Active' : 'Inactive'
          }`
      )
      .join('\n')
    navigator.clipboard.writeText(text)
    showToast('info', 'Copied to clipboard')
  }

  const exportOpen = Boolean(exportAnchorEl)

  // ────────────────────────────── Render ──────────────────────────────
  return (
    <Box>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link href='/' style={{ textDecoration: 'none' }}>
            Home
          </Link>
          <Typography color='text.primary'>SubCategory</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={
            <Box display='flex' alignItems='center' gap={2}>
              <Typography variant='h5' sx={{ fontWeight: 600 }}>
                SubCategory Management
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
                onClick={loadSubCategories}
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
                Add SubCategory
              </GlobalButton>
            </Box>
          }
          sx={{ pb: 1.5, pt: 1.5, '& .MuiCardHeader-action': { m: 0, alignItems: 'center' } }}
        />

        <Divider sx={{ mb: 2 }} />

        {/* Entries + Search */}
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
                onChange={e =>
                  setPagination(p => ({
                    ...p,
                    pageSize: Number(e.target.value),
                    pageIndex: 0
                  }))
                }
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
            onChange={val => setSearchText(String(val))}
            placeholder='Search subcategory...'
            sx={{ width: 360 }}
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
                          data: paginatedRows,
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

      {/* ────────────────────────────── Drawer: Add/Edit ────────────────────────────── */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { width: 420, boxShadow: '0px 0px 15px rgba(0,0,0,0.08)' } }}
      >
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
            <Typography variant='h5' fontWeight={600}>
              {isEdit ? 'Edit SubCategory' : 'Add SubCategory'}
            </Typography>
            <IconButton onClick={toggleDrawer} size='small'>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <GlobalAutocomplete
                  label='Category *'
                  placeholder='Select category'
                  options={categories}
                  getOptionLabel={option => option?.label || ''}
                  isOptionEqualToValue={(option, value) => option?.value == value?.value}
                  value={categories.find(c => c.value == formData.categoryId) || null}
                  onChange={(e, newValue) => {
                    handleFieldChange('categoryId', newValue ? newValue.value : '')
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <GlobalTextField
                  label='SubCategory Name *'
                  placeholder='Enter subcategory name'
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

      {/* ────────────────────────────── Delete Dialog ────────────────────────────── */}
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
          <DialogCloseButton onClick={() => setDeleteDialog({ open: false, row: null })} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>

        <DialogContent sx={{ px: 5, pt: 1 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: '#d32f2f' }}>{deleteDialog.row?.name || 'this subcategory'}</strong>?
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3, pt: 2 }}>
          <GlobalButton
            variant='outlined'
            color='secondary'
            onClick={() => setDeleteDialog({ open: false, row: null })}
            disabled={deleteLoading}
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
