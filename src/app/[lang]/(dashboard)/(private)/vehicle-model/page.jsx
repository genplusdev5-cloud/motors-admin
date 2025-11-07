// BannerType.jsx

'use client'

import { useState , useRef  } from 'react'

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
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import styles from '@core/styles/table.module.css'

import AddModalWindow from './AddModelWindow'
import SubCategory from '../subcategory/page'

const columnHelper = createColumnHelper()

// Helper to find the next ID for new records
const getNextId = data => {
  if (data.length === 0) return 1

  // Find the max ID and add 1
  return Math.max(...data.map(item => item.id), 0) + 1
}

// Mock Data (Real data structure)
const initialMockData = []

const VehicleModel = () => {
  const theme = useTheme()
  const router = useRouter()

  // 1. DATA STATE: Table Data
  const [data, setData] = useState(initialMockData)

  // 2. MODAL STATE: Controls open/close
  const [open, setOpen] = useState(false)

  // 3. EDITING STATE: Stores the row data currently being edited (or null for add)
  const [editingRow, setEditingRow] = useState(null)

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])

    const [anchorEl, setAnchorEl] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  // --- CRUD Logic Handlers ---

  /**
   * Opens the modal. Passes row data for editing, or null for adding.
   * @param {object | null} row - The row data to edit, or null to add.
   */
  const handleOpenModal = (row = null) => {
    setEditingRow(row) // Set data for editing (or null for add)
    setOpen(true)
  }

  /**
   * Closes the modal and resets the editing state.
   */
  const handleCloseModal = () => {
    setOpen(false)
    setEditingRow(null) // Clear editing state after close
  }

  /**
   * Handles adding a new record or saving changes to an existing one.
   * @param {object} data - The data from the modal ({id, name, description}).
   */
  const handleSaveData = data => {
    if (data.id) {
      // EDIT: Update the existing record
      setData(prevData =>
        prevData.map(item =>
          item.id === data.id
            ? {
                ...item,
                accQuality: data.name, // Maps to NAME column
                accQualityPo: data.description // Maps to DESCRIPTION column
              }
            : item
        )
      )
    } else {
      // ADD: Create a new record
      const newId = getNextId(data)

      const newRecord = {
        id: newId,
        vehicleType: data.vehicleType,
        name: data.name,
        category_id:data.category_id,
        SubCategory_id:data.SubCategory_id,
        make_id:data.make_id,
        color_id:data.color_id,
        body_type_id:data.body_data_id,
        engine_type_id:data.body_data_id,
        cylinder_id:data.cylinder_id,
        fuel_type_id:data.fuel_type_id,
        seating_capacity:data.seating_capacity,
        transmission: data.transmission,



        is_active: 'Active',

      }

      setData(prevData => [...prevData, newRecord])
    }

    handleCloseModal() // Close the modal after successful save
  }

  /**
   * Handles deleting a record.
   * @param {number} id - The ID of the record to delete.
   */

  const handleDeleteData = id => {
    // 1. Filter out the row with the matching id
    setData(prevData => prevData.filter(item => item.id !== id))
    console.log('Deleted row ID:', id)

    // 2. In a real app, you would call an API here to delete the record.
  }

    // Hidden file input
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
      handleFileUpload(file, selectedType) // custom handler
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



  // --- End of CRUD Logic ---

  // Component to display the correct sorting icon (unchanged)
  const SortIcon = ({ sortDir }) => {
    if (sortDir === 'asc') return <i className='tabler-arrow-up' style={{ fontSize: 16 }} />
    if (sortDir === 'desc') return <i className='tabler-arrow-down' style={{ fontSize: 16 }} />

    return <i className='tabler-arrows-sort' style={{ fontSize: 16, opacity: 0.5 }} />
  }

  // Helper function to create a sortable header component (unchanged)
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

    columnHelper.accessor('vehicleType', {
      header: ({ column }) => getSortableHeader('VEHICLE TYPE', column),
      cell: info => info.getValue()
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => getSortableHeader('NAME', column),
      cell: info => info.getValue()
    }),
    columnHelper.accessor('manufacturingYear', {
      header: ({ column }) => getSortableHeader('MANUFACTURING YEAR', column),
      cell: info => info.getValue()
    }),
    columnHelper.accessor('regYear', {
      header: ({ column }) => getSortableHeader('REGISTRATION YEAR', column),
      cell: info => info.getValue()
    }),

    columnHelper.accessor('transmission', {
      header: ({ column }) => getSortableHeader('TRANSMISSION', column),
      cell: info => info.getValue()
    }),

    columnHelper.accessor('millage', {
      header: ({ column }) => getSortableHeader('MILLAGE', column),
      cell: info => info.getValue()
    }),

    columnHelper.accessor('seatingCapacity', {
      header: ({ column }) => getSortableHeader('SEATING CAPACITY', column),
      cell: info => info.getValue()
    }),

    columnHelper.accessor('price', {
      header: ({ column }) => getSortableHeader('PRICE', column),
      cell: info => info.getValue()
    }),

    columnHelper.accessor('status', {
      header: 'STATUS',
      enableSorting: false,
      cell: info => {
        const statusValue = info.getValue()

        if (!statusValue) return null

        const bgColor = statusValue === 'Active' ? theme.palette.success.main : theme.palette.warning.main
        const textColor = theme.palette.common.white

        return (
          <Typography
            variant='caption'
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontWeight: 600,
              backgroundColor: bgColor,
              color: textColor
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
        {/* Header and Breadcrumbs */}
        <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Vehicle Model </span>
            {/* 💡 ADD: Click on Add Button opens the modal in Add mode (null) */}
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
              onClick={''}
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
            style={{
              fontSize: 14,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
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
            <Link href='/vehicle-model' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Vehicle Model
            </Link>
          </div>
        </div>
        {/* --- */}

        {/* Table controls (unchanged) */}
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
        {/* --- */}

        {/* Table (unchanged) */}
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
        {/* --- */}

        {/* Pagination (unchanged) */}
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={data.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      <AddModalWindow
        open={open}
        setOpen={setOpen}
        initialData={editingRow} // Pass the row data for editing (null for Add)
        onSave={handleSaveData} // Pass the function to handle Add/Edit logic
      />
    </>
  )
}

export default VehicleModel
