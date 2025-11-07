// Brand.jsx (or Brand.js)

'use client'

import { useState } from 'react'

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

// 💡 New Import: Modal Component
import AddModalWindow from './AddModelWindow'

const columnHelper = createColumnHelper()

// Mock Data Structure: Note the field names now match the data in your columns
const initialMockData = [
  // { id: 1, name: 'Standard A', description: 'PO-2023-001', status: 'Active', acc: 'ACC-1' },
  // { id: 2, name: 'Premium B', description: 'PO-2023-002', status: 'Inactive', acc: 'ACC-2' },
  // { id: 3, name: 'Basic C', description: 'PO-2023-003', status: 'Active', acc: 'ACC-3' }
]

// 💡 Helper function to generate the next ID
const getNextId = data => {
  if (data.length === 0) return 1

  return Math.max(...data.map(item => item.id)) + 1
}

const DealerUserRole = () => {
  const theme = useTheme()
  const router = useRouter()

  // 💡 State to control the Modal (open/close)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(initialMockData)

  // 💡 State for editing: stores the data of the row being edited, or null for 'Add'
  const [editingRow, setEditingRow] = useState(null)

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])

  // Functions to manage modal state
  const handleOpenModal = (row = null) => {
    // 💡 Set the row data for editing, or null for a new record
    setEditingRow(row)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)

    // 💡 Clear editing state when closing
    setEditingRow(null)
  }

  // 💡 CRUD FUNCTIONS

  // 1. Function to Add or Edit a record
  const handleSaveData = newRecordData => {
    if (newRecordData.id) {
      // EDIT existing record
      setData(prevData => prevData.map(item => (item.id === newRecordData.id ? newRecordData : item)))
      console.log('Edited Record:', newRecordData)
    } else {
      // ADD new record
      const newId = getNextId(data)

      const newRecord = {
        ...newRecordData,
        id: newId,
        status: 'Active', // Default status for new records
        acc: `ACC-${newId}` // Default 'acc' value
      }

      setData(prevData => [...prevData, newRecord])
      console.log('Added New Record:', newRecord)
    }

    handleCloseModal() // Close modal after saving
  }

  // 2. Function to Delete a record
  const handleDeleteData = id => {
    setData(prevData => prevData.filter(item => item.id !== id))
    console.log('Deleted Record ID:', id)

    // Optionally: Show a success toast/snackbar
  }

  // 💡 END OF CRUD FUNCTIONS

  // Component to display the correct sorting icon (unchanged)
  const SortIcon = ({ sortDir }) => {
    if (sortDir === 'asc') return <i className='tabler-arrow-up' style={{ fontSize: 16 }} />
    if (sortDir === 'desc') return <i className='tabler-arrow-down' style={{ fontSize: 16 }} />

    // Default unsorted icon
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
      {/* Conditionally render SortIcon if sorting is enabled for the column */}
      {column.getCanSort() && <SortIcon sortDir={column.getIsSorted()} />}
    </div>
  )

  const columns = [
    // ACTIONS column: Sorting Disabled
    columnHelper.accessor('action', {
      header: 'ACTIONS',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title='Edit'>
            {/* 💡 PASS THE CURRENT ROW DATA TO handleOpenModal for editing */}
            <IconButton onClick={() => handleOpenModal(row.original)} size='small'>
              <i className='tabler-edit' style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            {/* 💡 CALL THE NEW DELETE FUNCTION */}
            <IconButton onClick={() => handleDeleteData(row.original.id)} size='small'>
              <i className='tabler-trash' style={{ fontSize: 20, color: theme.palette.error.main }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      enableSorting: false
    }),

    // ACC QUALITY: Mapping to 'name'
    columnHelper.accessor('name', {
      header: ({ column }) => getSortableHeader('NAME', column),
      cell: info => info.getValue()
    }),

    // ACC QUALITY PO NAME: Mapping to 'description'
    columnHelper.accessor('description', {
      header: ({ column }) => getSortableHeader('DESCRIPTION', column),
      cell: info => info.getValue()
    }),

    // STATUS column: Sorting Disabled (Plain header)
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
        {/* Header and Breadcrumbs (unchanged) */}
        <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Dealer User Role </span>
            {/* 💡 Modal Call: Click on Add Button opens the modal */}
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
            <Link href='/user-roles' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              User Roles
            </Link>
            {' / '}
            <Link href='/dealer-user-role' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Dealer User Roles
            </Link>
          </div>
        </div>
        {/* --- */}

        {/* Table controls (unchanged) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
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
          <CustomTextField
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder='Search...'
            size='small'
            sx={{ width: '200px' }}
          />
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

      {/* 💡 Modal Component Render: Pass the editingRow data and the saveData function */}
      <AddModalWindow
        open={open}
        setOpen={setOpen}
        initialData={editingRow} // Pass data for editing
        onSave={handleSaveData} // Pass the save/edit function
      />
    </>
  )
}

export default DealerUserRole
