'use client'

import { useState, useEffect } from 'react'

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

import { toast } from 'react-toastify'

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

// Modal Component
import AddModalWindow from './AddModelWindow'

const columnHelper = createColumnHelper()

const Brand = () => {
  const theme = useTheme()
  const router = useRouter()

  const API_URL = 'http://motor-match.genplusinnovations.com:7023/'

  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [editingRow, setEditingRow] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [loading, setLoading] = useState(false)

  // NOTE: In a real app, use a secure method (e.g., Auth Context) for the token.
  const getToken = () =>
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNDk2NDk1LCJpYXQiOjE3NjE4OTE2OTUsImp0aSI6IjE5OTFmZDQzM2ExNDRkODFhMjY3NzViNTlmMWQ2YTFmIiwidXNlcl9pZCI6MX0.0DIgCY39dTnMjcnYa7u42QLkYtBI4c28tasI7no2q8M'

  // --- Fetch Brands from server
  const fetchBrand = async () => {
    setLoading(true)

    try {
      const token = getToken()

      if (!token) {
        throw new Error('No access token found. Please log in again.')
      }

      const resp = await fetch(`${API_URL}/api/brand-list/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!resp.ok) {
        const txt = await resp.text()

        throw new Error(`Failed to fetch categories: ${resp.status} ${txt}`)
      }

      const json = await resp.json()
      const list = Array.isArray(json) ? json : json.data || []

      const mapped = list.map(item => ({
        id: item.id,
        name: item.name ?? '',
        image: item.image ?? '',
        description: item.description && item.description.trim() !== '' ? item.description : '-',

        // Ensure is_active is mapped correctly for display
        is_active: item.is_active ?? (item.is_active ? 1 : 0),
        ...item
      }))

      setData(mapped)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error loading categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrand()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Open modal (null => add, row object => edit)
  const handleOpenModal = row => {
    setEditingRow(row)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setEditingRow(null)
  }

  const handleSaveBrand = async (payload, id) => {
    console.log(id ? '📝 Updating brand:' : '➕ Creating brand:', payload)

    try {
      const token = getToken()
      let resp

      // ✅ If ID exists → update (PUT)
      if (id) {
        console.log('PUT → Updating category id:', id, payload)

        resp = await fetch(`${API_URL}api/brand-update/${id}/`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      } else {
        // ✅ Create new (POST)
        console.log('POST → Creating category:', payload)

        resp = await fetch(`${API_URL}api/brand-add/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      }

      const result = await resp.json()

      if (!resp.ok) {
        console.error('❌ Save failed:', result)
        alert(result?.message || 'Save failed. Check console.')

        return
      }

      if (id) {
        // ✅ Update state immediately
        setData(prev =>
          prev.map(item => (item.id === id ? { ...item, ...payload, is_active: payload.is_active } : item))
        )
        toast('✅ Brand updated successfully!')
      } else {
        // ✅ Add to UI list instantly
        setData(prev => {
          const nextId = result.id ?? Math.max(0, ...prev.map(d => d.id || 0)) + 1

          return [...prev, { id: nextId, ...payload, is_active: payload.is_active }]
        })
        toast('✅ Brand added successfully!')
      }

      // ✅ Close modal and refresh from API
      handleCloseModal()
      await fetchBrand() // Refresh data for accuracy
    } catch (err) {
      console.error('❌ Error saving category:', err)
      alert(err.message || 'Unexpected error occurred.')
    }
  }

  // Delete a row using API then update local state
  const handleDeleteData = async id => {
    console.log('Deleting brand ID:', id)

    if (!id) {
      alert('Invalid brand ID')

      return
    }

    if (!confirm('Are you sure you want to delete this brand?')) return

    try {
      const token = getToken()

      // ✅ API call using PUT (delete-style)
      const resp = await fetch(`${API_URL}api/brand-delete/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }) // Backend is expecting { id: X }
      })

      // ❌ Handle errors
      if (!resp.ok) {
        const errorText = await resp.text()

        throw new Error(`Delete failed: ${resp.status} ${errorText}`)
      }

      // ✅ Instantly update UI after successful delete
      setData(prev => prev.filter(item => item.id !== id))
      toast('✅ Brand Deleted Successfully')
    } catch (err) {
      console.error('❌ Delete failed:', err)
      alert('Delete failed. Please check console for details.')
    }
  }

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

    // NAME
    columnHelper.accessor('name', {
      header: ({ column }) => getSortableHeader('NAME', column),
      cell: info => info.getValue()
    }),

    columnHelper.accessor('image', {
      header: ({ column }) => getSortableHeader('IMAGE', column),
      cell: info => info.getValue()
    }),

    // DESCRIPTION
    columnHelper.accessor('description', {
      header: ({ column }) => getSortableHeader('DESCRIPTION', column),
      cell: info => info.getValue()
    }),

    // STATUS column: Sorting Disabled (Plain header)
    columnHelper.accessor('is_active', {
      header: 'STATUS',
      enableSorting: false,
      cell: info => {
        // is_active can be 1, 0, true, or false
        const isActive = info.getValue() === 1 || info.getValue() === true
        const statusValue = isActive ? 'Active' : 'Inactive'

        // ✅ Theme-based colors
        const bgColor = isActive
          ? theme.palette.success.light // light green bg
          : theme.palette.error.light // light red bg

        const textColor = isActive ? theme.palette.success.main : theme.palette.error.main

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
              color: 'white',
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
        {/* Header and Breadcrumbs (unchanged) */}
        <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Brand </span>
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

            <Button
              onClick={fetchBrand}
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
            <Link href='/brand' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Brand
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

        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={data.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          sx={{
            color: theme.palette.primary.main,

            '& .MuiTablePagination-actions button': {
              '&.Mui-disabled': {
                color: theme.palette.action.disabled
              }
            },

            '& .MuiTablePagination-selectIcon': {
              color: theme.palette.primary.main
            }
          }}
        />
      </Card>

      <AddModalWindow open={open} setOpen={setOpen} editingRow={editingRow} onSaveCategory={handleSaveBrand} />
    </>
  )
}

export default Brand
