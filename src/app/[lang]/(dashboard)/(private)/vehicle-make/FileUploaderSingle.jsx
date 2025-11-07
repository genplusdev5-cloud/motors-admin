// // React Imports
// import { useState } from 'react'

// // MUI Imports
// import Box from '@mui/material/Box'
// import Avatar from '@mui/material/Avatar'
// import Typography from '@mui/material/Typography'
// import { useTheme } from '@mui/material/styles'

// // Third-party Imports
// import { useDropzone } from 'react-dropzone'

// const FileUploaderSingle = () => {
//   const theme = useTheme()
//   const [files, setFiles] = useState([])

//   const { getRootProps, getInputProps } = useDropzone({
//     multiple: false,
//     accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
//     onDrop: acceptedFiles => {
//       // Create object URL for preview
//       setFiles(acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })))
//     },
//     onDropRejected: () => {
//       alert('The file must be a valid image (.png, .jpg, .jpeg, .gif) and only one file is allowed.')
//     }
//   })

//   // File Preview Rendering
//   const img = files.map(file => (
//     <img
//       key={file.name}
//       alt={file.name}
//       className='single-file-image'
//       src={file.preview}
//       style={{
//         maxHeight: '100%',

//         maxWidth: 50,
//         objectFit: 'cover'
//       }}

//       onLoad={() => {
//         URL.revokeObjectURL(file.preview)
//       }}
//     />
//   ))

//   const handleRemoveFile = () => {

//     setFiles([])
//   }


//   const dropzoneSx = {

//     width: 501,
//     height: 40,

//     border: `1px dashed ${theme.palette.divider}`,
//     borderRadius: 1,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//     backgroundColor: theme.palette.action.hover,
//     cursor: 'pointer',
//     p: 1,

//   }

//   return (
//     <Box
//       {...getRootProps({ className: 'dropzone' })}
//       sx={dropzoneSx}
//     >
//       <input {...getInputProps()} />
//       {files.length ? (

//         <Box sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between', // Space out items
//             width: '100%',
//             px: 1 // Padding for inner content
//         }}>
//           {/* File Name */}
//           <Typography variant='caption' color='text.primary' noWrap sx={{ flexGrow: 1, maxWidth: 'calc(100% - 70px)' }}>
//             {files[0].name}
//           </Typography>

//           {/* Image Preview & Remove Icon Container */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             {img}
//             <i
//               className='tabler-x'
//               onClick={(e) => {
//                 e.stopPropagation() /
//                 handleRemoveFile()
//               }}
//               style={{ fontSize: 16, cursor: 'pointer' }}
//             />
//           </Box>
//         </Box>
//       ) : (

//         <div className='flex items-center flex-col'>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Avatar variant='rounded' sx={{ height: 24, width: 24 }}>
//               <i className='tabler-upload' style={{ fontSize: 14 }} />
//             </Avatar>
//             <Typography variant='caption' color='text.secondary' sx={{ whiteSpace: 'nowrap' }}>
//               Click or Drag file to upload
//             </Typography>
//           </Box>
//         </div>
//       )}
//     </Box>
//   )
// }

// export default FileUploaderSingle

'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

const FileUploaderSingle = () => {
  const theme = useTheme()
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      )
    },
    onDropRejected: () => {
      alert('Only one valid image file (.png, .jpg, .jpeg, .gif) is allowed.')
    }
  })

  const img = files.map(file => (
    <img
      key={file.name + file.lastModified} // ✅ unique key
      alt={file.name}
      src={file.preview}
      style={{
        maxHeight: 30,
        maxWidth: 30,
        borderRadius: 4,
        objectFit: 'cover'
      }}
      onLoad={() => URL.revokeObjectURL(file.preview)}
    />
  ))

  const handleRemoveFile = e => {
    e.stopPropagation()
    setFiles([])
  }

  // 🔹 Compact & Responsive Dropzone Styles
  const dropzoneSx = {
    width: '100%',
    maxWidth: 500,
    minHeight: 36,
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
    p: 0.5,
    transition: 'all 0.2s ease',
    [theme.breakpoints.down('sm')]: {
      minHeight: 34,
      p: 0.4
    },
    [theme.breakpoints.up('md')]: {
      minHeight: 40
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected
    }
  }

  return (
    <Box {...getRootProps({ className: 'dropzone' })} sx={dropzoneSx}>
      <input {...getInputProps()} />
      {files.length ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            px: 1,
            gap: 1
          }}
        >
          {/* File Name */}
          <Typography
            variant='body2'
            color='text.primary'
            noWrap
            sx={{
              flexGrow: 1,
              maxWidth: { xs: 'calc(100% - 70px)', sm: 'calc(100% - 100px)' },
              fontSize: { xs: '0.7rem', sm: '0.8rem' }
            }}
          >
            {files[0].name} {/* ✅ Correct file name */}
          </Typography>

          {/* Preview & Remove */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {img}
            <i
              className='tabler-x'
              onClick={handleRemoveFile}
              style={{
                fontSize: 16,
                cursor: 'pointer',
                color: theme.palette.error.main
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.6
          }}
        >
          <Avatar
            variant='rounded'
            sx={{
              height: 20,
              width: 20,
              backgroundColor: theme.palette.action.focus
            }}
          >
            <i className='tabler-upload' style={{ fontSize: 12 }} />
          </Avatar>
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          >
            Click or Drag file to upload
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default FileUploaderSingle
