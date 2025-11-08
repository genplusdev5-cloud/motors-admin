

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// API Services

// Next.js Imports
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


import Swal from 'sweetalert2'

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

// Custom Components
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import styles from '@core/styles/table.module.css'
import AddModalWindow from './AddModelWindow'

// Toast Notifications (optional)
import { getBannerType, addBannerType, updateBannerType, deleteBannerType } from '@/services/bannerstypeApi'

const columnHelper = createColumnHelper()

const BannerType = () => {
  const theme = useTheme()
  const router = useRouter()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedType, setSelectedType] = useState(null)

  const fileInputRef = useRef(null)

  // ---------------------------
  // ✅ Fetch Data from API
  // ---------------------------
  const fetchBannerTypes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getBannerType()

      setData(result || [])
    } catch (err) {
      console.error('Error fetching banner types:', err)
      setError('Failed to fetch banner types.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBannerTypes()
  }, [fetchBannerTypes])

  // ---------------------------
  // ✅ Handle Add / Edit
  // ---------------------------
  const handleSaveData = async formData => {
    try {
      if (formData.id) {
        await updateBannerType(formData.id, formData)
        toast.success('Banner type updated successfully!')
      } else {
        await addBannerType(formData)
        toast.success('Banner type added successfully!')
      }

      // Optimistic update
      await fetchBannerTypes()
    } catch (err) {
      console.error('Error saving banner type:', err)
      toast.error(`Failed to ${formData.id ? 'update' : 'add'} banner type.`)
    }

    handleCloseModal()
  }

  // ---------------------------
  // ✅ Handle Delete
  // ---------------------------
  const handleDeleteData = async id => {
    Swal.fire({
      text: 'Are you sure you want to delete this Banner Type?',

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
          await deleteBannerType(id)
          toast.success('Banner type deleted successfully!')
          await fetchBannerTypes()
        } catch (error) {
          console.error('Delete banner type  error:', error)

          const errorMsg = error.response?.data?.message || 'Failed to delete banner type.'

          toast.error(errorMsg)
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('banner type deletion cancelled.')
      }
    })
  }


  // ---------------------------
  // ✅ Modal Controls
  // ---------------------------
  const handleOpenModal = row => {
    setEditingRow(row)
    setOpen(true)
  }

  const handleCloseModal = () => {
    setOpen(false)
    setEditingRow(null)
  }

  // ---------------------------
  // ✅ File Upload Menu Logic
  // ---------------------------
  const handleExportClick = e => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleMenuItemClick = type => {
    setSelectedType(type)
    handleClose()
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleFileChange = event => {
    const file = event.target.files[0]

    if (file && selectedType) {
      console.log(`File selected: ${file.name} for type: ${selectedType}`)
    }

    event.target.value = ''
  }

  const getAcceptType = () => {
    switch (selectedType) {
      case 'csv':
        return '.csv'
      case 'xlsx':
        return '.xlsx'
      case 'json':
      case 'pdf':
      default:
        return ''
    }
  }

  // ---------------------------
  // ✅ Table Columns
  // ---------------------------
  const columns = [
    // ACTIONS
    columnHelper.accessor('action', {
      header: 'ACTIONS',
      enableSorting: false,
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
      )
    }),

    // ✅ IMAGE COLUMN — now with bordered container
    columnHelper.accessor('logoUrl', {
      header: 'IMAGE',
      enableSorting: false,
      cell: info => {
        const imageUrl = info.getValue()

        return (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              border: '1px solid',
              borderColor: theme.palette.divider,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.background.default
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt='banner'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <Typography variant='caption' sx={{ color: theme.palette.text.secondary }}>

              </Typography>
            )}
          </Box>
        )
      }
    }),

    columnHelper.accessor('name', {
      header: 'NAME',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('width', {
      header: 'WIDTH',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('height', {
      header: 'HEIGHT',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('description', {
      header: 'DESCRIPTION',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('is_active', {
      header: 'STATUS',
      enableSorting: false,
      cell: info => {
        const statusValue = info.getValue() === 1 || info.getValue() === 'Active' ? 'Active' : 'Inactive'
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

  // ---------------------------
  // ✅ Table Configuration
  // ---------------------------
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

  // ---------------------------
  // ✅ UI Render
  // ---------------------------
  if (loading && data.length === 0) {
    return (
      <Card sx={{ p: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Typography variant='h6'>Loading Data...</Typography>
      </Card>
    )
  }

  if (error && data.length === 0) {
    return (
      <Card sx={{ p: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Typography variant='h6' color='error'>
          {error}
        </Typography>
        <Button onClick={fetchBannerTypes} sx={{ ml: 2 }}>
          Try Again
        </Button>
      </Card>
    )
  }

  return (
    <>
      <Card sx={{ p: '1.5rem' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Banners Type</span>
            <Button
              onClick={() => handleOpenModal(null)}
              startIcon={<i className='tabler-plus' />}
              variant='contained'
              size='small'
              sx={{ textTransform: 'none' }}
            >
              Add
            </Button>
            <Button onClick={fetchBannerTypes} variant='outlined' size='small' disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          <div style={{ fontSize: 14, color: theme.palette.text.secondary, display: 'flex', gap: 6 }}>
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
            <Link href='/banners-type' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Banners Type
            </Link>
          </div>
        </div>

        {/* TABLE CONTROLS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p style={{ margin: 0 }}>Show</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
                table.setPageIndex(0)
              }}
              style={{
                padding: '6px 8px',
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <p style={{ margin: 0 }}>entries</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CustomTextField
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search...'
              size='small'
              sx={{ width: '200px' }}
            />

            <Button variant='outlined' size='small' onClick={handleExportClick}>
              Upload
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={() => handleMenuItemClick('csv')}>Upload CSV</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('xlsx')}>Upload Excel</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('json')}>Upload JSON</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('pdf')}>Upload PDF</MenuItem>
            </Menu>
            <input
              type='file'
              accept={getAcceptType()}
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* TABLE */}
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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center'>
                    {loading ? 'Fetching data...' : 'No data available'}
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

      <AddModalWindow open={open} setOpen={setOpen} initialData={editingRow} onSave={handleSaveData} />
    </>
  )
}

export default BannerType
