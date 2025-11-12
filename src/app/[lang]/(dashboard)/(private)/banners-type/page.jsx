// 'use client'

// import { useState, useEffect, useRef, useCallback } from 'react'

// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// // MUI Imports
// import Card from '@mui/material/Card'
// import Button from '@mui/material/Button'
// import TablePagination from '@mui/material/TablePagination'
// import Box from '@mui/material/Box'
// import IconButton from '@mui/material/IconButton'
// import Tooltip from '@mui/material/Tooltip'
// import { useTheme } from '@mui/material/styles'
// import Typography from '@mui/material/Typography'
// import { Menu, MenuItem } from '@mui/material'

// import { toast } from 'react-toastify'
// import Swal from 'sweetalert2'

// import {
//   useReactTable,
//   getCoreRowModel,
//   getPaginationRowModel,
//   flexRender,
//   createColumnHelper,
//   getSortedRowModel,
//   getFilteredRowModel
// } from '@tanstack/react-table'

// // Updated import from corrected service file
// import { getBannerType, addBannerType , updateBannerType, deleteBannerType } from '@/services/bannerstypeApi'

// // Assuming these are custom components from your project
// import CustomTextField from '@core/components/mui/TextField'
// import TablePaginationComponent from '@components/TablePaginationComponent'
// import styles from '@core/styles/table.module.css'

// // Modal Component
// import AddModelWindow from './AddModelWindow'

// const columnHelper = createColumnHelper()

// const BannerTypePage = () => { // Renamed from 'bannerType' for clarity
//   const theme = useTheme()
//   const router = useRouter() // eslint-disable-line no-unused-vars

//   const [open, setOpen] = useState(false)
//   const [data, setData] = useState([])
//   const [editingRow, setEditingRow] = useState(null)
//   const [globalFilter, setGlobalFilter] = useState('')
//   const [columnFilters, setColumnFilters] = useState([]) // eslint-disable-line no-unused-vars
//   const [sorting, setSorting] = useState([])
//   const [loading, setLoading] = useState(false)

//   const [anchorEl, setAnchorEl] = useState(null)
//   const [selectedType, setSelectedType] = useState(null)

//   // --- Core Functions for Data Management ---

//   const fetchBannerTypes = useCallback(async () => { // Renamed from fetchMileage
//     setLoading(true)

//     try {
//       const categoryData = await getBannerType()

//       setData(categoryData)
//     } catch (error) {
//       console.error('Error fetching banner type:', error)
//       toast.error('Failed to load banner type.')
//       setData([])
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   // Save category (handles both add and update by calling API)
//  const handleSaveCategory = async (formData, id) => {
//   try {
//     const name = formData.get('name');

//     // Frontend duplicate check
//     const existingItem = data.find(
//       item => item.name?.trim().toLowerCase() === name?.trim().toLowerCase()
//     );

//     const isDuplicate = existingItem && existingItem.id !== id;

//     if (isDuplicate) {
//       toast.warning('Name already exists. Please use a different name.');

// return;
//     }

//     let savedItem;

//     if (id) {
//       savedItem = await updateBannerType(id, formData);
//       toast.success('Banner type updated successfully!');

//       // Update table data locally
//       setData(prev => prev.map(item => (item.id === id ? savedItem : item)));
//     } else {
//       savedItem = await addBannerType(formData);
//       toast.success('Banner type added successfully!');

//       // Add new item to table locally
//       setData(prev => [...prev, savedItem]);
//     }

//     handleCloseModal(); // Close modal
//   } catch (error) {
//     const errorMsg = error.response?.data?.message || 'An error occurred while saving the banner type.';

//     toast.error(errorMsg);
//   }
// };


//   const handleDelete = async id => {
//     Swal.fire({
//       text: 'Are you sure you want to delete this banner type?',
//       showCancelButton: true,
//       confirmButtonText: 'Delete',
//       cancelButtonText: 'Cancel',
//       reverseButtons: true,
//       buttonsStyling: false,
//       customClass: {
//         confirmButton: 'swal-confirm-btn',
//         cancelButton: 'swal-cancel-btn'
//       },
//       didOpen: () => {
//         const confirmBtn = Swal.getConfirmButton()
//         const cancelBtn = Swal.getCancelButton()

//         // Apply custom styles (keeping your original style settings)
//         confirmBtn.style.textTransform = 'none'
//         cancelBtn.style.textTransform = 'none'
//         confirmBtn.style.borderRadius = '8px'
//         cancelBtn.style.borderRadius = '8px'
//         confirmBtn.style.padding = '8px 20px'
//         cancelBtn.style.padding = '8px 20px'
//         confirmBtn.style.marginLeft = '10px'
//         cancelBtn.style.marginRight = '10px'

//         confirmBtn.style.backgroundColor = '#212c62'
//         confirmBtn.style.color = '#fff'
//         confirmBtn.style.border = '1px solid #212c62'

//         cancelBtn.style.border = '1px solid #212c62'
//         cancelBtn.style.color = '#212c62'
//         cancelBtn.style.backgroundColor = 'transparent'
//       }
//     }).then(async result => {
//       if (result.isConfirmed) {
//         try {
//           await deleteBannerType (id)
//           toast.success('Banner type deleted successfully!')
//           await fetchBannerTypes()
//         } catch (error) {
//           console.error('Delete banner type error:', error)

//           const errorMsg = error.response?.data?.message || 'Failed to delete banner type.'

//           toast.error(errorMsg)
//         }
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         toast.info('Banner type deletion cancelled.')
//       }
//     })
//   }

//   // --- Fetch categories on initial load
//   useEffect(() => {
//     fetchBannerTypes()
//   }, [fetchBannerTypes])

//   // Open modal (null => add, row object => edit)
//   const handleOpenModal = row => {
//     setEditingRow(row)
//     setOpen(true)
//   }

//   const handleCloseModal = () => {
//     setOpen(false)
//     setEditingRow(null)
//   }

//   // Hidden file input
//   const fileInputRef = useRef(null)

//   const handleExportClick = event => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }

//   // 👇 when user clicks menu item
//   const handleMenuItemClick = type => {
//     setSelectedType(type)
//     handleClose()

//     // open hidden file input
//     if (fileInputRef.current) fileInputRef.current.click()
//   }

//   // 👇 handle file selection (for Import)
//   const handleFileChange = event => {
//     const file = event.target.files[0]

//     if (file && selectedType) {
//       // NOTE: Placeholder for actual import logic
//       toast.info(`Attempting to upload ${selectedType.toUpperCase()} file: ${file.name}`)
//     }

//     event.target.value = '' // reset input (for re-uploading same file)
//   }

//   // restrict file extensions based on type
//   const getAcceptType = () => {
//     switch (selectedType) {
//       case 'csv':
//         return '.csv'
//       case 'xlsx':
//         return '.xlsx'
//       case 'json':
//         return '.json'
//       case 'pdf':
//         return '.pdf'
//       default:
//         return ''
//     }
//   }

//   // Sorting icon & helper
//   const SortIcon = ({ sortDir }) => {
//     if (sortDir === 'asc') return <i className='tabler-arrow-up' style={{ fontSize: 16 }} />
//     if (sortDir === 'desc') return <i className='tabler-arrow-down' style={{ fontSize: 16 }} />

//     return <i className='tabler-arrows-sort' style={{ fontSize: 16, opacity: 0.5 }} />
//   }

//   const getSortableHeader = (headerName, column, IconComponent) => (
//     <div
//       className='cursor-pointer select-none flex items-center'
//       onClick={column.getToggleSortingHandler()}
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: 4,
//         justifyContent: 'space-between',
//         fontWeight: '500',
//         color: theme.palette.text.primary,
//         width: '100%'
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//         {IconComponent}
//         <Typography variant='subtitle2' component='span' fontWeight={500} color='inherit'>
//           {headerName}
//         </Typography>
//       </Box>

//       {column.getCanSort() && <SortIcon sortDir={column.getIsSorted()} />}
//     </div>
//   )

//   const columns = [
//     columnHelper.accessor('action', {
//       header: 'ACTIONS',
//       cell: ({ row }) => (
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Tooltip title='Edit'>
//             <IconButton onClick={() => handleOpenModal(row.original)} size='small'>
//               <i className='tabler-edit' style={{ fontSize: 20 }} />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title='Delete'>
//             <IconButton onClick={() => handleDelete(row.original.id)} size='small'>
//               <i className='tabler-trash' style={{ fontSize: 20, color: theme.palette.error.main }} />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       ),
//       enableSorting: false
//     }),
//     columnHelper.accessor('name', {
//       header: ({ column }) => getSortableHeader('NAME', column),
//       cell: info => info.getValue()
//     }),
//   columnHelper.accessor('image', {
//     header: ({ column }) => getSortableHeader('IMAGE', column),
//     cell: info => {
//       const imageUrl = info.getValue()

//       return (
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             width: 80, // Container width
//             height: 40, // Container height
//             border: `1px solid ${theme.palette.divider}`,
//             borderRadius: 1,
//             overflow: 'hidden'
//           }}
//         >
//           {imageUrl ? (
//             <img
//               src={imageUrl}
//               alt="Banner Thumbnail"
//               style={{
//                 maxWidth: '100%',
//                 maxHeight: '100%',
//                 objectFit: 'contain' // Ensures the image fits within the box without cropping
//               }}
//             />
//           ) : (
//             <i className='' style={{ color: theme.palette.text.secondary }} />
//           )}
//         </Box>
//       )
//     }
//   }),

//     columnHelper.accessor('width', {
//       header: ({ column }) => getSortableHeader('WIDTH', column),
//       cell: info => info.getValue()
//     }),
//     columnHelper.accessor('height', {
//       header: ({ column }) => getSortableHeader('HEIGHT', column),
//       cell: info => info.getValue()
//     }),

//     columnHelper.accessor('description', {
//       header: ({ column }) => getSortableHeader('DESCRIPTION', column),
//       cell: info => {
//         const value = info.getValue()

//         return value && value.trim() !== '' ? value : '-' // ✅ Show dash when empty
//       }
//     }),

//     columnHelper.accessor('is_active', {
//       header: 'STATUS',
//       enableSorting: false,
//       cell: info => {
//         let statusValue = info.getValue()

//         // Convert numeric / boolean → readable text
//         if (statusValue === 1 || statusValue === true) statusValue = 'Active'
//         if (statusValue === 0 || statusValue === false) statusValue = 'Inactive'

//         // ✅ Theme-based colors
//         const bgColor =
//           statusValue === 'Active'
//             ? theme.palette.success.light // light green bg
//             : theme.palette.error.light // light red bg

//         const textColor = statusValue === 'Active' ? theme.palette.success.main : theme.palette.error.main // eslint-disable-line no-unused-vars

//         return (
//           <Typography
//             variant='body2'
//             sx={{
//               display: 'inline-block',
//               px: 2,
//               py: 0.5,
//               borderRadius: 2,
//               fontWeight: 600,
//               backgroundColor: bgColor,
//               color:
//                 theme.palette.mode === 'dark' && statusValue === 'Active'
//                   ? theme.palette.success.main
//                   : theme.palette.mode === 'dark' && statusValue === 'Inactive'
//                     ? theme.palette.error.main
//                     : 'white', // Improved color logic for dark mode
//               textAlign: 'center',
//               minWidth: 80,
//               textTransform: 'capitalize'
//             }}
//           >
//             {statusValue}
//           </Typography>
//         )
//       }
//     })
//   ]

//   const table = useReactTable({
//     data,
//     columns,
//     state: { columnFilters, globalFilter, sorting },
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel()
//   })

//   return (
//     <>
//       <Card sx={{ p: '1.5rem' }}>
//         <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${theme.palette.divider}` }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
//             <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Banner Type</span>
//             <Button
//               onClick={() => handleOpenModal(null)}
//               startIcon={<i className='tabler-plus' />}
//               variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
//               size='small'
//               sx={{
//                 textTransform: 'none',
//                 backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
//                 color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
//                 borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
//                 '&:hover': {
//                   backgroundColor:
//                     theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.08)',
//                   borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
//                 }
//               }}
//             >
//               Add
//             </Button>

//             <Button
//               onClick={fetchBannerTypes}
//               startIcon={<i className='tabler-refresh' />}
//               variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
//               size='small'
//               sx={{
//                 textTransform: 'none',
//                 backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
//                 color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
//                 borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
//                 '&:hover': {
//                   backgroundColor:
//                     theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.08)',
//                   borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
//                 }
//               }}
//             >
//               Refresh
//             </Button>
//           </div>

//           <div
//             style={{ fontSize: 14, color: theme.palette.text.secondary, display: 'flex', alignItems: 'center', gap: 6 }}
//           >
//             <Link href='/' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
//               <Box display='flex' alignItems='center' gap={1}>
//                 <i className='tabler-smart-home' style={{ fontSize: 20 }} />
//               </Box>
//             </Link>
//             {' / '}
//             <Link href='/masters' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
//               Masters
//             </Link>
//             {' / '}
//             <Link href='/banner-type' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
//             Banner Type
//             </Link>
//           </div>
//         </div>

//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: 10
//           }}
//         >
//           {/* Left: Show entries */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//             <p style={{ margin: 0, color: theme.palette.text.primary }}>Show</p>
//             <select
//               value={table.getState().pagination.pageSize}
//               onChange={e => {
//                 table.setPageSize(Number(e.target.value))
//                 table.setPageIndex(0)
//               }}
//               style={{
//                 padding: '6px 8px',
//                 borderRadius: 4,
//                 border: `1px solid ${theme.palette.divider}`,
//                 backgroundColor: theme.palette.background.paper,
//                 color: theme.palette.text.primary
//               }}
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//             </select>
//             <p style={{ margin: 0, color: theme.palette.text.primary }}>entries</p>
//           </div>

//           {/* Right: Search + Export dropdown */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <CustomTextField
//               value={globalFilter}
//               onChange={e => setGlobalFilter(e.target.value)}
//               placeholder='Search...'
//               size='small'
//               sx={{ width: '200px' }}
//             />

//             {/* Export button */}
//             <Button
//               variant={theme.palette.mode === 'light' ? 'contained' : 'outlined'}
//               size='small'
//               onClick={handleExportClick}
//               sx={{
//                 textTransform: 'none',
//                 backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'transparent',
//                 color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : theme.palette.text.primary,
//                 borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none',
//                 '&:hover': {
//                   backgroundColor:
//                     theme.palette.mode === 'light' ? theme.palette.primary.dark : 'rgba(255,255,255,0.08)',
//                   borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'none'
//                 }
//               }}
//             >
//               Export
//             </Button>

//             {/* 🔽 Menu for choosing upload type */}
//             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//               <MenuItem onClick={() => handleMenuItemClick('csv')}>Upload CSV</MenuItem>
//               <MenuItem onClick={() => handleMenuItemClick('xlsx')}>Upload Excel (.xlsx)</MenuItem>
//               <MenuItem onClick={() => handleMenuItemClick('json')}>Upload JSON</MenuItem>
//               <MenuItem onClick={() => handleMenuItemClick('pdf')}>Upload PDF</MenuItem>
//             </Menu>

//             {/* Hidden file input */}
//             <input
//               type='file'
//               accept={getAcceptType()}
//               style={{ display: 'none' }}
//               ref={fileInputRef}
//               onChange={handleFileChange}
//             />
//           </div>
//         </div>

//         <div className='overflow-x-auto'>
//           <table className={styles.table}>
//             <thead>
//               {table.getHeaderGroups().map(headerGroup => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map(header => (
//                     <th key={header.id} colSpan={header.colSpan}>
//                       {header.isPlaceholder ? null : (
//                         <div
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 4,
//                             justifyContent: 'space-between',
//                             fontWeight: '500',
//                             color: theme.palette.text.primary
//                           }}
//                         >
//                           {flexRender(header.column.columnDef.header, header.getContext())}
//                         </div>
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={columns.length} className='text-center'>
//                      Loading...
//                   </td>
//                 </tr>
//               ) : table.getRowModel().rows.length === 0 ? (
//                 <tr>
//                   <td colSpan={columns.length} className='text-center'>
//                     No data available
//                   </td>
//                 </tr>
//               ) : (
//                 table.getRowModel().rows.map(row => (
//                   <tr key={row.id}>
//                     {row.getVisibleCells().map(cell => (
//                       <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
//                     ))}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         <TablePagination
//           component={() => <TablePaginationComponent table={table} />}
//           count={data.length}
//           rowsPerPage={table.getState().pagination.pageSize}
//           page={table.getState().pagination.pageIndex}
//           onPageChange={(_, page) => table.setPageIndex(page)}
//         />
//       </Card>

//       <AddModelWindow open={open} setOpen={setOpen} onSave={handleSaveCategory} initialData={editingRow} />
//     </>
//   )
// }

// export default BannerTypePage



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
import { getBannerType, addBannerType, updateBannerType, deleteBannerType } from '@/services/bannerstypeApi'

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
      const categoryData = await getBannerType()

      setData(categoryData)
    } catch (error) {
      console.error('Error fetching banner type:', error)
      toast.error('Failed to load banner type')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Save category (handles both add and update by calling API)
  const handleSaveCategory = async (categoryData, id) => {
    try {


      // ✅ Proceed if not duplicate
      if (id) {
        await updateBannerType(id, categoryData)
        toast.success('Banner Type updated successfully!')
      } else {
        await addBannerType(categoryData)
        toast.success('Banner type  added successfully!')
      }

      handleCloseModal() // Close modal after success
      await fetchMake() // Refresh data in the table
    } catch (error) {
      console.error('Save Banner type  error:', error)

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'An error occurred while saving the banner type .'

      toast.error(errorMsg)
    }
  }

  const handleDelete = async id => {
    Swal.fire({
      text: 'Are you sure you want to delete this Banner Type ?',

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
          toast.success('banner type deleted successfully!')
          await fetchMake()
        } catch (error) {
          console.error('Delete banner type error:', error)

          const errorMsg = error.response?.data?.message || 'Failed to delete vehicle banner type.'

          toast.error(errorMsg)
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('banner type  deletion cancelled.')
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
      header: 'IMAGE',
      enableSorting: false,
      cell: info => {
        const image = info.getValue()

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {image ? (
              <img
                src={image}
                alt={info.row.original.name}
                style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 4 }}
              />
            ) : (
              <Typography variant='caption'>image</Typography>
            )}
          </Box>
        )
      }
    }),



       columnHelper.accessor('width', {
      header: ({ column }) => getSortableHeader('WIDTH', column),
      cell: info => info.getValue()
    }),
       columnHelper.accessor('height', {
      header: ({ column }) => getSortableHeader('HEIGHT', column),
      cell: info => info.getValue()
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
            <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Banner Type</span>
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
            <Link href='/banner-type' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Banner Type
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
