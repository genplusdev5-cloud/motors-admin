'use client'

import { useEffect, useState } from 'react'

import { useTheme } from '@mui/material/styles'
import { toast } from 'react-toastify'

import Swal from 'sweetalert2'
import Checkbox from '@mui/material/Checkbox'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TablePagination from '@mui/material/TablePagination'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Autocomplete from '@mui/material/Autocomplete'
import ButtonGroup from '@mui/material/ButtonGroup'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import RefreshIcon from '@mui/icons-material/Refresh'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'

import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'



import styles from '@core/styles/table.module.css'
import AddModelWindow from './AddModelWindow'

const columnHelper = createColumnHelper()

export default function AdminPriviledges() {
  const theme = useTheme()

  const [modulesData, setModulesData] = useState([])
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [editingRow, setEditingRow] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])

  const [headerCheckboxes, setHeaderCheckboxes] = useState({
    create: false,
    read: false,
    update: false,
    delete: false
  })

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await getAdminRole()

      setRoles(res || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast.error('Failed to load Admin Roles.')
    }
  }

  // Load modules
  const loadModules = async () => {
    try {
      const res = await getAdminModulesList()

      setModulesData(res || [])
    } catch (err) {
      console.error('Error loading modules:', err)
      toast.error('Failed to load Modules list.')
    }
  }

  // Load permissions of selected role
  const loadRolePermissions = async role => {
    if (!role) {
      // Clear modules if no role selected
      await loadModules()

      return
    }

    try {
      const modulesList = await getAdminModulesList()

      // Map modules with role permissions
      const updatedModules = modulesList.map(module => {
        const permission = role.permissions?.find(p => p.moduleId === module.id)

        return {
          ...module,
          create: permission?.create || 0,
          read: permission?.read || 0,
          update: permission?.update || 0,
          delete: permission?.delete || 0
        }
      })

      setModulesData(updatedModules)
    } catch (error) {
      console.error('Error loading role permissions:', error)
      toast.error('Failed to load permissions for this role.')
    }
  }

  useEffect(() => {
    fetchRoles()
    loadModules()
  }, [])

  // Sync header checkboxes
  useEffect(() => {
    ;['create', 'read', 'update', 'delete'].forEach(col => {
      const allChecked = modulesData.length > 0 && modulesData.every(row => row[col] === 1)

      setHeaderCheckboxes(prev => ({ ...prev, [col]: allChecked }))
    })
  }, [modulesData])

  // Header checkbox change
  const handleHeaderCheckboxChange = (columnId, checked) => {
    setHeaderCheckboxes(prev => ({ ...prev, [columnId]: checked }))
    setModulesData(prev =>
      prev.map(row => ({
        ...row,
        [columnId]: checked ? 1 : 0
      }))
    )
  }

  // Role selection
  const handleRoleSelect = (event, value) => {
    setSelectedRole(value)
    loadRolePermissions(value)
  }

  // Columns
  const columns = [
    columnHelper.accessor('name', { header: 'MODULES', cell: info => info.getValue() }),
    ...['create', 'read', 'update', 'delete'].map(col =>
      columnHelper.accessor(col, {
        header: () => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              size='small'
              checked={headerCheckboxes[col]}
              onChange={e => handleHeaderCheckboxChange(col, e.target.checked)}
              sx={{ ml: 1 }}
              disabled={!selectedRole}
            />
            {col.toUpperCase()}
          </Box>
        ),
        cell: info => (
          <Checkbox
            checked={info.getValue() === 1}
            disabled={!selectedRole}
            onChange={e => {
              const rowIndex = info.row.index

              setModulesData(prev => {
                const newData = [...prev]

                newData[rowIndex] = { ...newData[rowIndex], [col]: e.target.checked ? 1 : 0 }

                return newData
              })
            }}
          />
        )
      })
    )
  ]

  const table = useReactTable({
    data: modulesData,
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

  // Update permissions
  const handleUpdatePermissions = async () => {
    if (!selectedRole) return

    try {
      const payload = {
        roleId: selectedRole.id,
        permissions: modulesData.map(module => ({
          moduleId: module.id,
          create: module.create,
          read: module.read,
          update: module.update,
          delete: module.delete
        }))
      }

      await updateAdminRole(selectedRole.id, payload)
      toast.success(`Permissions for "${selectedRole.name}" updated successfully!`)
      loadRolePermissions(selectedRole)
      fetchRoles()
    } catch (error) {
      console.error('Error updating permissions:', error)
      toast.error(error.response?.data?.message || 'Failed to update permissions.')
    }
  }

  // Save role (Add / Update)
  const handleSaveRole = async (formData, id) => {
    try {
      if (id) {
        await updateAdminRole(id, formData)
        toast.success('Admin Role updated successfully!')
      } else {
        await addAdminRole(formData)
        toast.success('Admin Role added successfully!')
      }

      setOpenModal(false)
      fetchRoles()
    } catch (error) {
      console.error('Error saving role:', error)
      toast.error(`Failed to save Admin Role: ${error.response?.data?.message || 'Check console for details.'}`)
    }
  }

  // Delete role
  const handleDeleteRole = async id => {
    Swal.fire({
      text: 'Are you sure you want to delete this Role?',
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

        confirmBtn.style.textTransform = 'none'
        cancelBtn.style.textTransform = 'none'
        confirmBtn.style.borderRadius = '8px'
        cancelBtn.style.borderRadius = '8px'
        confirmBtn.style.padding = '8px 20px'
        cancelBtn.style.padding = '8px 20px'
        confirmBtn.style.marginLeft = '10px'
        cancelBtn.style.marginRight = '10px'
        confirmBtn.style.backgroundColor = '#212c62'
        confirmBtn.style.color = '#fff'
        confirmBtn.style.border = '1px solid #212c62'
        cancelBtn.style.border = '1px solid #212c62'
        cancelBtn.style.color = '#212c62'
        cancelBtn.style.backgroundColor = 'transparent'
      }
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await deleteAdminRole(id)
          toast.success('Role deleted successfully!')
          setSelectedRole(null)
          fetchRoles()
        } catch (error) {
          console.error('Error deleting role:', error)
          toast.error(error.response?.data?.message || 'Failed to delete role.')
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Role deletion cancelled.')
      }
    })
  }

  // Duplicate role
  const handleDuplicateRole = async role => {
    if (!role) return

    try {
      const duplicated = await duplicateAdminRole({ id: role.id })

      // ❗REMOVE id → so modal behaves like ADD but with prefilled data
      const cleaned = { ...duplicated }

      delete cleaned.id

      toast.success(`Role "${role.name}" duplicated successfully!`)

      fetchRoles()

      setEditingRow(cleaned) // pass data without ID
      setSelectedRole(cleaned)
      setOpenModal(true)
    } catch (error) {
      console.error('Error duplicating role:', error)
      toast.error(error.response?.data?.message || 'Check console.')
    }
  }

  return (
    <>
      <Card sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pb: 2 }}>
          <Typography variant='h6'>Admin Privileges</Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 3 }} alignItems='center'>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Autocomplete
              fullWidth
              options={roles}
              getOptionLabel={option => option.name || ''}
              value={selectedRole}
              onChange={handleRoleSelect}
              renderInput={params => <CustomTextField {...params} label='Admin Roles' />}
            />
          </Grid>

          <ButtonGroup variant='outlined' aria-label='action buttons' sx={{ mt: 4 }}>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingRow(null)
                setOpenModal(true)
              }}
            >
              Add
            </Button>

            <Button
              startIcon={<EditIcon />}
              disabled={!selectedRole}
              onClick={() => {
                if (selectedRole) {
                  setEditingRow(selectedRole)
                  setOpenModal(true)
                }
              }}
            >
              Edit
            </Button>

            <Button
              color='secondary'
              startIcon={<FileCopyIcon />}
              disabled={!selectedRole}
              onClick={() => {
                if (selectedRole) {
                  const duplicated = { ...selectedRole }

                  // Remove ID → makes it a new role
                  delete duplicated.id

                  // Optional: clear name to avoid conflicts
                  duplicated.name = selectedRole.name + ' Copy'

                  // MOST IMPORTANT FIX
                  setEditingRow(duplicated) // 👉 Send values to modal

                  setOpenModal(true)
                }
              }}
            >
              Duplicate
            </Button>

            <Button
              color='error'
              startIcon={<DeleteIcon />}
              disabled={!selectedRole}
              onClick={() => selectedRole && handleDeleteRole(selectedRole.id)}
            >
              Delete
            </Button>

            <Button color='info' startIcon={<RefreshIcon />} onClick={fetchRoles}>
              Refresh
            </Button>
          </ButtonGroup>

          <Button
            variant='contained'
            sx={{ mt: 4, ml: 5 }}
            startIcon={<i className='tabler-device-floppy' />}
            disabled={!selectedRole}
            onClick={handleUpdatePermissions} // ✅ Fixed
          >
            Update
          </Button>
        </Grid>

        {/* Table controls */}
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

        {/* Table */}
        <div className='overflow-x-auto mt-10'>
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
                  <td colSpan={columns.length} style={{ textAlign: 'center' }}>
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
          count={modulesData.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      <AddModelWindow open={openModal} setOpen={setOpenModal} editingRow={editingRow} onSaveRole={handleSaveRole} />
    </>
  )
}
