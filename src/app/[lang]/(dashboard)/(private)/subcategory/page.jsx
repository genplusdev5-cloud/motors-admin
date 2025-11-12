'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { toast } from 'react-toastify'

// 💠 MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TablePagination from '@mui/material/TablePagination'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import { MenuItem } from '@mui/material'

// 💠 Table Imports
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'

import Swal from 'sweetalert2'

// 💠 Custom Components
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import styles from '@core/styles/table.module.css'
import AddModalWindow from './AddModelWindow'

// 💠 API imports
import { getSubCategories, updateSubCategory, addSubCategory, deleteSubCategory } from '@/services/subCategoryApi'

const columnHelper = createColumnHelper()

const SubCategory = () => {
  const theme = useTheme()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [editingRow, setEditingRow] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  const fileInputRef = useRef(null)

  // 🔹 Modal handlers
  const handleOpenModal = row => {
    setEditingRow(row)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setEditingRow(null)
    setOpen(false)
  }

  // 🔹 Fetch data
  const fetchSubCategories = useCallback(async () => {
    setLoading(true)

    try {
      const list = await getSubCategories()

      const mapped = list.map(item => ({
        id: item.id,
        name: item.name ?? '',
        description: item.description ?? '',
        category: item.category_name ?? '',
        category_id: item.category_id ?? '',
        is_active: item.is_active ?? 0
      }))

      setData(mapped)
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      toast.error('Error fetching subcategories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubCategories()
  }, [fetchSubCategories])

  // 🔹 Save / Update handler
  const handleSaveCategory = async (payload, id) => {
    try {
      const isDuplicate = data.some(
        item => item.name?.trim().toLowerCase() === payload.name?.trim().toLowerCase() && item.id !== id
      )

      if (isDuplicate) {
        toast.warning('SubCategory name already exists')

        return
      }

      if (id) {
        await updateSubCategory(id, payload)
        toast.success('SubCategory updated successfully!')
      } else {
        await addSubCategory(payload)
        toast.success('SubCategory added successfully!')
      }

      handleCloseModal()
      await fetchSubCategories()
    } catch (error) {
      console.error('Save subcategory error:', error)
      toast.error(error.response?.data?.message || 'Error saving subcategory')
    }
  }

  // 🔹 Delete handler
  const handleDeleteData = async id => {
    Swal.fire({
      text: 'Are you sure you want to delete this Subcategory?',

      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      },
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton()
        const cancelBtn = Swal.getCancelButton()

        // Common style
        confirmBtn.style.textTransform = 'none'
        cancelBtn.style.textTransform = 'none'
        confirmBtn.style.borderRadius = '8px'
        cancelBtn.style.borderRadius = '8px'
        confirmBtn.style.padding = '8px 20px'
        cancelBtn.style.padding = '8px 20px'
        confirmBtn.style.marginLeft = '10px'
        cancelBtn.style.marginRight = '10px'

        // ✅ Confirm (Delete) Button
        confirmBtn.style.backgroundColor = '#212c62'
        confirmBtn.style.color = '#fff'
        confirmBtn.style.border = '1px solid #212c62'

        // ❌ Cancel Button
        cancelBtn.style.border = '1px solid #212c62'
        cancelBtn.style.color = '#212c62'
        cancelBtn.style.backgroundColor = 'transparent'
      }
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await deleteSubCategory(id)
          toast.success('SubCategory deleted successfully!')
          await fetchSubCategories()
        } catch (error) {
          console.error('Delete subcategory error:', error)

          const errorMsg = error.response?.data?.message || 'Failed to delete sub category.'

          toast.error(errorMsg)
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('sub category deletion cancelled.')
      }
    })
  }



  // 🔹 File Upload & Export handlers
  const handleExportClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleMenuItemClick = type => {
    setSelectedType(type)
    handleClose()
    fileInputRef.current?.click()
  }

  const getAcceptType = () => {
    switch (selectedType) {
      case 'csv':
        return '.csv'
      case 'xlsx':
        return '.xlsx'
      case 'json':
        return '.json'
      case 'pdf':
        return '.pdf'
      default:
        return ''
    }
  }

  const handleFileChange = e => {
    const file = e.target.files?.[0]

    if (!file) return
    toast.info(`File "${file.name}" selected for upload (${selectedType.toUpperCase()})`)
    e.target.value = ''
  }

  // 🔹 Table columns
  const columns = [
    columnHelper.accessor('action', {
      header: 'ACTIONS',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title='Edit'>
            <IconButton onClick={() => handleOpenModal(row.original)} size='small'>
              <i className='tabler-edit' style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton onClick={() => handleDeleteData(row.original.id)} size='small'>
              <i className='tabler-trash' style={{ fontSize: 20, color: theme.palette.error.main }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      enableSorting: false
    }),
    columnHelper.accessor('category', { header: 'CATEGORY', cell: info => info.getValue() }),
    columnHelper.accessor('name', { header: 'NAME', cell: info => info.getValue() }),
    columnHelper.accessor('description', { header: 'DESCRIPTION', cell: info => info.getValue() }),

    columnHelper.accessor('is_active', {
      header: 'STATUS',
      enableSorting: false,
      cell: info => {
        let statusValue = info.getValue()

        // Convert numeric / boolean → readable text
        if (statusValue === 1 || statusValue === true) statusValue = 'Active'
        if (statusValue === 0 || statusValue === false) statusValue = 'Inactive'

        // ✅ Theme-based colors
        const bgColor =
          statusValue === 'Active'
            ? theme.palette.success.light // light green bg
            : theme.palette.error.light // light red bg

        const textColor = statusValue === 'Active' ? theme.palette.success.main : theme.palette.error.main // eslint-disable-line no-unused-vars

        return (
          <Typography
            variant='body2'
            sx={{
              display: 'inline-block',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: bgColor,
              color:
                theme.palette.mode === 'dark' && statusValue === 'Active'
                  ? theme.palette.success.main
                  : theme.palette.mode === 'dark' && statusValue === 'Inactive'
                    ? theme.palette.error.main
                    : 'white', // Improved color logic for dark mode
              textAlign: 'center',
              minWidth: 80,
              textTransform: 'capitalize'
            }}
          >
            {statusValue}
          </Typography>
        )
      }
    })
  ]

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter, sorting },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  // 🔹 Render
  return (
    <>
      <Card sx={{ p: '1.5rem' }}>
        {/* Header */}
         <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>SubCategory</span>
            <Button
              onClick={() => handleOpenModal(null)}
              startIcon={<i className='tabler-plus' />}
              variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
              size='small'
              sx={{
                textTransform: 'none',
                backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
                color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.08)',
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
                }
              }}
            >
              Add
            </Button>

            <Button
              onClick={fetchSubCategories}
              startIcon={<i className='tabler-refresh' />}
              variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
              size='small'
              sx={{
                textTransform: 'none',
                backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
                color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.08)',
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
                }
              }}
            >
              Refresh
            </Button>
          </div>

          <div
            style={{ fontSize: 14, color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Link href='/' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              <Box display='flex' alignItems='center' gap={1}>
                <i className='tabler-smart-home' style={{ fontSize: 20 }} />
              </Box>
            </Link>
            {' / '}
            <Link href='/masters' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Masters
            </Link>
            {' / '}
            <Link href='/subcategory' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Subcategory
            </Link>
          </div>
        </div>

        {/* Table Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p>Show</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              style={{ padding: '6px 8px', borderRadius: 4 }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <p>entries</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CustomTextField
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search...'
              size='small'
              sx={{ width: '200px' }}
            />
            <Button variant='contained' size='small' onClick={handleExportClick}>
              Export
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => handleMenuItemClick('csv')}>Upload CSV</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('xlsx')}>Upload Excel (.xlsx)</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('json')}>Upload JSON</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('pdf')}>Upload PDF</MenuItem>
            </Menu>
            <input
              ref={fileInputRef}
              type='file'
              accept={getAcceptType()}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>

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
              {loading ? (
                <tr>

                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>No data available</td>
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

        {/* Pagination */}
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={data.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      {/* Add/Edit Modal */}
      <AddModalWindow open={open} setOpen={setOpen} initialData={editingRow} onSave={handleSaveCategory} />
    </>
  )
}

export default SubCategory
