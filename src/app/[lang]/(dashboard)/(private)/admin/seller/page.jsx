'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

// MUI
import {
  Box,
  Card,
  CardHeader,
  Typography,
  IconButton,
  Divider,
  Drawer,
  Grid,
  Breadcrumbs,
  Chip,
  Select,
  MenuItem,
  FormControl
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import RefreshIcon from '@mui/icons-material/Refresh'

// Global components
import GlobalButton from '@/components/common/GlobalButton'
import GlobalTextField from '@/components/common/GlobalTextField'
import GlobalTextarea from '@/components/common/GlobalTextarea'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// Table
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'

import styles from '@core/styles/table.module.css'

// --------------------------------------------------

const columnHelper = createColumnHelper()

// --------------------------------------------------

export default function Seller() {
  const [rows, setRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    status: 1
  })

  const nameRef = useRef(null)

  // --------------------------------------------------
  // MOCK LOAD (API later)
  const loadData = async () => {
    setLoading(true)
    setTimeout(() => {
      setRows(prev => prev)
      setLoading(false)
    }, 400)
  }

  useEffect(() => {
    loadData()
  }, [])

  // --------------------------------------------------
  // ADD / EDIT
  const handleAdd = () => {
    setIsEdit(false)
    setFormData({ id: null, name: '', description: '', status: 1 })
    setDrawerOpen(true)
    setTimeout(() => nameRef.current?.querySelector('input')?.focus(), 100)
  }

  const handleEdit = row => {
    setIsEdit(true)
    setFormData({
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status === 'Active' ? 1 : 0
    })
    setDrawerOpen(true)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)

    if (isEdit) {
      setRows(prev =>
        prev.map(r =>
          r.id === formData.id
            ? {
                ...r,
                name: formData.name,
                description: formData.description,
                status: formData.status ? 'Active' : 'Inactive'
              }
            : r
        )
      )
    } else {
      const newId = rows.length ? Math.max(...rows.map(r => r.id)) + 1 : 1
      setRows(prev => [
        ...prev,
        {
          id: newId,
          sno: prev.length + 1,
          name: formData.name,
          description: formData.description,
          status: 'Active'
        }
      ])
    }

    setDrawerOpen(false)
    setLoading(false)
  }

  const handleDelete = id => {
    setRows(prev => prev.filter(r => r.id !== id))
  }

  // --------------------------------------------------
  // FILTER + PAGINATION
  const filteredRows = useMemo(() => {
    if (!searchText) return rows
    return rows.filter(r => r.name.toLowerCase().includes(searchText.toLowerCase()))
  }, [rows, searchText])

  const paginatedRows = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination])

  // --------------------------------------------------
  // TABLE COLUMNS
  const columns = [
    columnHelper.accessor('sno', { header: 'S.No' }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size='small' onClick={() => handleEdit(info.row.original)}>
            <i className='tabler-edit text-blue-600 text-lg' />
          </IconButton>
          <IconButton size='small' color='error' onClick={() => handleDelete(info.row.original.id)}>
            <i className='tabler-trash text-red-600 text-lg' />
          </IconButton>
        </Box>
      )
    }),
    columnHelper.accessor('name', { header: 'Seller Name' }),
    columnHelper.accessor('description', { header: 'Description' }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <Chip
          label={info.getValue()}
          size='small'
          sx={{
            color: '#fff',
            bgcolor: info.getValue() === 'Active' ? 'success.main' : 'error.main',
            borderRadius: '6px'
          }}
        />
      )
    })
  ]

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

  // --------------------------------------------------

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href='/'>Home</Link>
        <Typography color='text.primary'>Seller</Typography>
      </Breadcrumbs>

      <Card sx={{ p: 3 }}>
        <CardHeader
          title={<Typography variant='h5' fontWeight={600}>Seller</Typography>}
          action={
            <Box display='flex' gap={2}>
              <GlobalButton
                startIcon={<RefreshIcon />}
                loading={loading}
                onClick={loadData}
              >
                Refresh
              </GlobalButton>
              <GlobalButton startIcon={<AddIcon />} onClick={handleAdd}>
                Add Seller
              </GlobalButton>
            </Box>
          }
        />

        <Divider sx={{ mb: 2 }} />

        {/* Entries + Search */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControl size='small' sx={{ width: 120 }}>
            <Select
              value={pagination.pageSize}
              onChange={e => setPagination(p => ({ ...p, pageSize: e.target.value }))}
            >
              {[10, 25, 50].map(v => (
                <MenuItem key={v} value={v}>{v} entries</MenuItem>
              ))}
            </Select>
          </FormControl>

          <GlobalTextField
            size='small'
            placeholder='Search seller...'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            sx={{ width: 260 }}
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
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center py-8'>
                    No seller found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
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

      {/* Drawer */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 420 } }}
      >
        <Box sx={{ p: 5 }}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              {isEdit ? 'Edit Seller' : 'Add Seller'}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <GlobalTextField
                  label='Seller Name'
                  required
                  inputRef={nameRef}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <GlobalTextarea
                  label='Description'
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>

            <Box mt={4} display='flex' gap={2}>
              <GlobalButton type='submit' fullWidth loading={loading}>
                {isEdit ? 'Update' : 'Save'}
              </GlobalButton>
              <GlobalButton
                variant='outlined'
                color='secondary'
                fullWidth
                onClick={() => setDrawerOpen(false)}
              >
                Cancel
              </GlobalButton>
            </Box>
          </form>
        </Box>
      </Drawer>
    </Box>
  )
}
