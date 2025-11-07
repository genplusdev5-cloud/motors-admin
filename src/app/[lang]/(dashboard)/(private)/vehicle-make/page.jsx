'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TablePagination from '@mui/material/TablePagination'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { Menu, MenuItem } from '@mui/material'

import { toast } from 'react-toastify'

import Swal from 'sweetalert2'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'

// Updated import from corrected service file
import { getMake, addMake, updateMake, deleteMake } from '@/services/vehicleMakeApi'

// Assuming these are custom components from your project
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import styles from '@core/styles/table.module.css'

// Modal Component
import AddModelWindow from './AddModelWindow'

const columnHelper = createColumnHelper()

const VehicleMake = () => {
  const theme = useTheme()
  const router = useRouter() // eslint-disable-line no-unused-vars

  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [editingRow, setEditingRow] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([]) // eslint-disable-line no-unused-vars
  const [sorting, setSorting] = useState([])
  const [loading, setLoading] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  // --- Core Functions for Data Management ---

  const fetchMake = useCallback(async () => {
    setLoading(true)

    try {
      const categoryData = await getMake()

      setData(categoryData)
    } catch (error) {
      console.error('Error fetching vehicle make:', error)
      toast.error('Failed to load Vehicle Make.')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Save category (handles both add and update by calling API)
  const handleSaveCategory = async (categoryData, id) => {
    try {
      // ✅ FRONTEND DUPLICATE CHECK
      const isDuplicate = data.some(
        item => item.name?.trim().toLowerCase() === categoryData.name?.trim().toLowerCase() && item.id !== id // allow same name for editing same record
      )

      if (isDuplicate) {
        toast.warning('Vehicle Make name already exists. ')

        return // ❌ Stop — don’t send to backend
      }

      // ✅ Proceed if not duplicate
      if (id) {
        await updateMake(id, categoryData)
        toast.success('Vehicle Make updated successfully!')
      } else {
        await addMake(categoryData)
        toast.success('Vehicle Make added successfully!')
      }

      handleCloseModal() // Close modal after success
      await fetchMake() // Refresh data in the table
    } catch (error) {
      console.error('Save vehicle make error:', error)

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'An error occurred while saving the vehicle make.'

      toast.error(errorMsg)
    }
  }

  const handleDelete = async id => {
    if (!id) {
      toast.error('Invalid vehicle make ID')

      return
    }

    Swal.fire({
      text: 'Are you sure you want to delete this Vehicle Make?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete ',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary'
      }
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await deleteMake(id)
          toast.success('Vehicle Make deleted successfully!')
          await fetchMake()
        } catch (error) {
          console.error('Error deleting Vehicle Make:', error)
          toast.error(error.message || 'Failed to delete vehicle make.')
        }
      }
    })
  }

  // --- Fetch categories on initial load
  useEffect(() => {
    fetchMake()
  }, [fetchMake])

  // Open modal (null => add, row object => edit)
  const handleOpenModal = row => {
    setEditingRow(row)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setEditingRow(null)
  }

  // Hidden file input logic for export/import (retained)
  const fileInputRef = useRef(null)

  const handleExportClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // 👇 when user clicks menu item
  const handleMenuItemClick = type => {
    setSelectedType(type)
    handleClose()

    // open hidden file input
    if (fileInputRef.current) fileInputRef.current.click()
  }

  // 👇 handle file selection
  const handleFileChange = event => {
    const file = event.target.files[0]

    if (file && selectedType) {
      toast.info(`Attempting to upload ${selectedType.toUpperCase()} file: ${file.name}`)
    }

    event.target.value = '' // reset input (for re-uploading same file)
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

  // Sorting icon & helper same as your original code

  const SortIcon = ({ sortDir }) => {
    if (sortDir === 'asc') return <i className='tabler-arrow-up' style={{ fontSize: 16 }} />
    if (sortDir === 'desc') return <i className='tabler-arrow-down' style={{ fontSize: 16 }} />

    return <i className='tabler-arrows-sort' style={{ fontSize: 16, opacity: 0.5 }} />
  }

  const getSortableHeader = (headerName, column, IconComponent) => (
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {IconComponent}
        <Typography variant='subtitle2' component='span' fontWeight={500} color='inherit'>
          {headerName}
        </Typography>
      </Box>

      {column.getCanSort() && <SortIcon sortDir={column.getIsSorted()} />}
    </div>
  )

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
            <IconButton onClick={() => handleDelete(row.original.id)} size='small'>
              <i className='tabler-trash' style={{ fontSize: 20, color: theme.palette.error.main }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      enableSorting: false
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => getSortableHeader('NAME', column),
      cell: info => info.getValue()
    }),

    // Vehicle Make Image column (assuming API returns a URL or file name here)
    columnHelper.accessor('image', {
      header: 'LOGO',
      enableSorting: false,
      cell: info => {
        const imageUrl = info.getValue()

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={info.row.original.name}
                style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }}
              />
            ) : (
              <Typography variant='caption'>N/A</Typography>
            )}
          </Box>
        )
      }
    }),
    columnHelper.accessor('description', {
      header: ({ column }) => getSortableHeader('DESCRIPTION', column),
      cell: info => {
        const value = info.getValue()

        return value && value.trim() !== '' ? value : '-' // ✅ Show dash when empty
      }
    }),

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

  return (
    <>
      <Card sx={{ p: '1.5rem' }}>
        <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Vehicle Make</span>
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
              onClick={fetchMake}
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
            <Link href='/vehicle make' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Vehicle Make
            </Link>
          </div>
        </div>

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

            {/* 🔽 Menu for choosing upload type */}
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
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className='text-center'>
                    <i className='tabler-loader animate-spin' style={{ fontSize: 24 }} /> Loading...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center'>
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

        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={data.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      <AddModelWindow open={open} setOpen={setOpen} onSaveCategory={handleSaveCategory} editingRow={editingRow} />
    </>
  )
}

export default VehicleMake
