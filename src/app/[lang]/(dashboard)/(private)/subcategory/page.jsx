'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { toast } from 'react-toastify'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TablePagination from '@mui/material/TablePagination'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { MenuItem } from '@mui/material'
import Menu from '@mui/material/Menu'

// TanStack Table Imports
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'

// Assuming these are custom components from your project
import Swal from 'sweetalert2' // SweetAlert library

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import styles from '@core/styles/table.module.css'

// Modal Component (Ensure this path is correct)
import AddModalWindow from './AddModelWindow'

// 💡 NECESSARY IMPORTS for your logic
import { getSubCategories, updateSubCategory, addSubCategory, deleteSubCategory } from '@/services/subCategoryApi'

const columnHelper = createColumnHelper()

const SubCategory = () => {
  const theme = useTheme()
  const router = useRouter()

  // Removed unused API_URL constant

  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [editingRow, setEditingRow] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  // 💡 HANDLERS: Modal Logic
  const handleOpenModal = (row = null) => {
    setEditingRow(row) // Set data for editing, or null for adding
    setOpen(true)
  }

  const handleCloseModal = () => {
    setEditingRow(null)
    setOpen(false)
  }

  // 💡 HANDLERS: File Upload Placeholder
  const handleFileUpload = (file, type) => {
    toast.info(`Uploading file: ${file.name} (Type: ${type}). Logic needs implementation.`)

    // Your actual file upload logic using the API service goes here
  }

  // 1. FETCH DATA (Wrapped in useCallback)
  const fetchSubCategories = useCallback(async () => {
    setLoading(true)

    try {
      const list = await getSubCategories() // ⭐ API Call to fetch data

      // Map response structure to component structure
      const mapped = list.map(item => ({
        id: item.id,
        name: item.name ?? '',
        description: item.description ?? '',
        category: item.category_name ?? 'N/A', // Mapped Category Name for display
        category_id: item.category_id ?? '',
        raw_is_active: item.is_active ?? 0,
        status: item.is_active === 1 ? 'Active' : 'Inactive',
        ...item
      }))

      setData(mapped)
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      toast.error(`Error fetching data. Check console for details.`)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  // 💡 HANDLER: Refresh button
  const fetchCategories = () => {
    fetchSubCategories()
  }

  // 💡 USEEFFECT: Call fetchSubCategories on component mount
  useEffect(() => {
    fetchSubCategories()
  }, [fetchSubCategories])

  // 2. SAVE/UPDATE DATA (using service functions)
  const handleSaveCategory = async (payload, id) => {
    try {
      // ✅ FRONTEND DUPLICATE CHECK
      const isDuplicate = data.some(
        item => item.name?.trim().toLowerCase() === payload.name?.trim().toLowerCase() && item.id !== id // allow same name for editing the same record
      )

      if (isDuplicate) {
        toast.warning('SubCategory name already exists')

        return // ❌ Stop here — don’t call the API
      }

      // ✅ Proceed with API call if not duplicate
      if (id) {
        await updateSubCategory(id, payload)
        toast.success('SubCategory updated successfully!')
      } else {
        await addSubCategory(payload)
        toast.success('SubCategory added successfully!')
      }

      handleCloseModal()
      await fetchSubCategories() // Refresh data in the table
    } catch (error) {
      console.error('Save subcategory error:', error)

      // Get appropriate error message from backend
      const errorMsg =
        error.response?.data?.message || error.message || 'An error occurred while saving the subcategory.'

      toast.error(errorMsg)
    }
  }

  // 3. DELETE DATA (using service function and SweetAlert)


const handleDeleteData = async id => {
  Swal.fire({

    text: 'Are you sure you want to delete this subcategory?',

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
        toast.success('Subcategory deleted successfully!')
        await fetchSubCategories()
      } catch (error) {
        console.error('Delete subcategory error:', error)
        const errorMsg =
          error.response?.data?.message || 'Failed to delete subcategory.'
        toast.error(errorMsg)
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      toast.info('Subcategory deletion cancelled.')
    }
  })
}





  // Hidden file input logic for Export/Import functionality
  const fileInputRef = useRef(null)

  const handleExportClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // when user clicks menu item
  const handleMenuItemClick = type => {
    setSelectedType(type)
    handleClose()

    // open hidden file input
    if (fileInputRef.current) fileInputRef.current.click()
  }

  // handle file selection
  const handleFileChange = event => {
    const file = event.target.files[0]

    if (file && selectedType) {
      handleFileUpload(file, selectedType) // custom handler placeholder
    }

    event.target.value = '' // reset input
  }

  // restrict file extensions based on type
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

  // Utility components for table header
  const SortIcon = ({ sortDir }) => {
    if (sortDir === 'asc') return <i className='tabler-arrow-up' style={{ fontSize: 16 }} />
    if (sortDir === 'desc') return <i className='tabler-arrow-down' style={{ fontSize: 16 }} />

    return <i className='tabler-arrows-sort' style={{ fontSize: 16, opacity: 0.5 }} />
  }

  const getSortableHeader = (headerName, column) => (
    <div
      className='cursor-pointer select-none flex items-center'
      onClick={column.getToggleSortingHandler()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        justifyContent: 'space-between',
        fontWeight: '500',
        color: theme.palette.text.primary,
        width: '100%'
      }}
    >
      <Typography variant='subtitle2' component='span' fontWeight={500} color='inherit'>
        {headerName}
      </Typography>
      {column.getCanSort() && <SortIcon sortDir={column.getIsSorted()} />}
    </div>
  )

  // TanStack Table Column Definitions
  const columns = [
    // ACTIONS column
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

    // Category Name (Uses the mapped 'category' key)
    columnHelper.accessor('category', {
      header: ({ column }) => getSortableHeader('CATEGORY', column),
      cell: info => info.getValue()
    }),

    columnHelper.accessor('name', {
      header: ({ column }) => getSortableHeader('NAME', column),
      cell: info => info.getValue()
    }),

    columnHelper.accessor('description', {
      header: ({ column }) => getSortableHeader('DESCRIPTION', column),
      cell: info => info.getValue()
    }),

    // Status column
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

  // TanStack Table Initialization
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

  // Component Render
  return (
    <>
      <Card sx={{ p: '1.5rem' }}>
        {/* Header and Breadcrumbs */}
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
              onClick={fetchCategories}
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
              SubCategory
            </Link>
          </div>
        </div>
        {/* --- */}

        {/* Table Controls (Show entries, Search, Export) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          {/* Left: Show entries */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ margin: 0, color: theme.palette.text.primary }}>Show</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
                table.setPageIndex(0)
              }}
              style={{
                padding: '6px 8px',
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <p style={{ margin: 0, color: theme.palette.text.primary }}>entries</p>
          </div>

          {/* Right: Search + Export dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CustomTextField
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search...'
              size='small'
              sx={{ width: '200px' }}
            />

            {/* Export button */}
            <Button
              variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
              size='small'
              onClick={handleExportClick}
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
              Export
            </Button>

            {/* Menu for choosing upload type */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => handleMenuItemClick('csv')}>Upload CSV</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('xlsx')}>Upload Excel (.xlsx)</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('json')}>Upload JSON</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('pdf')}>Upload PDF</MenuItem>
            </Menu>

            {/* Hidden file input */}
            <input
              type='file'
              accept={getAcceptType()}
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* --- */}

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            justifyContent: 'space-between',
                            fontWeight: '500',
                            color: theme.palette.text.primary
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center'>
                    {loading ? 'Loading data...' : 'No data available'}
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
        {/* --- */}

        {/* Pagination */}
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={data.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      {/* Modal Component Render */}
      <AddModalWindow
        open={open}
        setOpen={setOpen}
        initialData={editingRow} // Pass the row data for editing (null for Add)
        onSave={handleSaveCategory} // Pass the function that handles API call and table refresh
      />
    </>
  )
}

export default SubCategory
