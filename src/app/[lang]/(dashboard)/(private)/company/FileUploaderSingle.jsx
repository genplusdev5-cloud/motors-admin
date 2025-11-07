// 'use client'

// import { useState } from 'react'

// import Box from '@mui/material/Box'
// import Avatar from '@mui/material/Avatar'
// import Typography from '@mui/material/Typography'
// import { useTheme } from '@mui/material/styles'
// import { useDropzone } from 'react-dropzone'

// const FileUploaderSingle = ({ onFileChange }) => {
//   const theme = useTheme()
//   const [files, setFiles] = useState([])

//   const toBase64 = file =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader()

//       reader.readAsDataURL(file)
//       reader.onload = () => resolve(reader.result)
//       reader.onerror = error => reject(error)
//     })

//   const { getRootProps, getInputProps } = useDropzone({
//     multiple: false,
//     accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
//     onDrop: async acceptedFiles => {
//       const file = acceptedFiles[0]

//       if (file) {
//         const base64 = await toBase64(file)

//         setFiles([{ ...file, preview: URL.createObjectURL(file) }])
//         onFileChange(base64)
//       }
//     },
//     onDropRejected: () => {
//       alert('Only one valid image file (.png, .jpg, .jpeg, .gif) is allowed.')
//     }
//   })

//   const handleRemoveFile = e => {
//     e.stopPropagation()
//     setFiles([])
//     onFileChange('')
//   }

// const dropzoneSx = {
//   width: '100%',
//   maxWidth: 500,
//   minHeight: 36,
//   border: `1px dashed ${theme.palette.divider}`,
//   borderRadius: 1,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: theme.palette.action.hover,
//   cursor: 'pointer',
//   p: 0.5,
//   transition: 'all 0.2s ease',
//   '&:hover': { backgroundColor: theme.palette.action.selected }
// }

//   return (
//     <Box {...getRootProps({ className: 'dropzone' })} sx={dropzoneSx}>
//       <input {...getInputProps()} />
//       {files.length ? (
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             width: '100%',
//             px: 1,
//             gap: 1
//           }}
//         >
//           {/* File Name */}
//           <Typography
//             variant='body2'
//             color='text.primary'
//             noWrap
//             sx={{
//               flexGrow: 1,
//               maxWidth: { xs: 'calc(100% - 70px)', sm: 'calc(100% - 100px)' },
//               fontSize: { xs: '0.7rem', sm: '0.8rem' }
//             }}
//           >
//             {files[0].name} {/* ✅ Correct file name */}
//           </Typography>

//           {/* Preview & Remove */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//              <Box
//               component='img'
//               src={files[0].preview}
//               alt={files[0].name}
//               sx={{
//                 height: 30,
//                 width: 30,
//                 borderRadius: 1,
//                 objectFit: 'cover'
//               }}
//             />
//             <i
//               className='tabler-x'
//               onClick={handleRemoveFile}
//               style={{
//                 fontSize: 16,
//                 cursor: 'pointer',
//                 color: theme.palette.error.main
//               }}
//             />
//           </Box>
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: 0.6
//           }}
//         >
//           <Avatar
//             variant='rounded'
//             sx={{
//               height: 20,
//               width: 20,
//               backgroundColor: theme.palette.action.focus
//             }}
//           >
//             <i className='tabler-upload' style={{ fontSize: 12 }} />
//           </Avatar>
//           <Typography
//             variant='caption'
//             color='text.secondary'
//             sx={{
//               whiteSpace: 'nowrap',
//               fontSize: { xs: '0.7rem', sm: '0.75rem' }
//             }}
//           >
//             Click or Drag file to upload
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default FileUploaderSingle

// 'use client'
//  import { useState } from 'react'
// import { useCallback } from 'react'

// import { Box, Typography } from '@mui/material'

// import Avatar from '@mui/material/Avatar'

// import { useTheme } from '@mui/material/styles'
// import { useDropzone } from 'react-dropzone'

// const FileUploaderSingle = ({ label = 'Upload Image', onFileChange }) => {
//     const theme = useTheme()
//      const [files, setFiles] = useState([])

//   const onDrop = useCallback(acceptedFiles => {
//     if (acceptedFiles.length > 0) {
//       // Pass the actual File object
//       onFileChange(acceptedFiles[0])
//     }
//   }, [onFileChange])

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: { 'image/*': [] },
//     multiple: false,
//     onDrop
//   })

//     const dropzoneSx = {
//     width: '100%',
//     maxWidth: 500,
//     minHeight: 36,
//     border: `1px dashed ${theme.palette.divider}`,
//     borderRadius: 1,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: theme.palette.action.hover,
//     cursor: 'pointer',
//     p: 0.5,
//     transition: 'all 0.2s ease',
//     '&:hover': { backgroundColor: theme.palette.action.selected }
//   }

//   return (
//    <Box {...getRootProps({ className: 'dropzone' })} sx={dropzoneSx}>
//       <input {...getInputProps()} />
//       {files.length ? (
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             width: '100%',
//             px: 1,
//             gap: 1
//           }}
//         >
//           {/* File Name */}
//           <Typography
//             variant='body2'
//             color='text.primary'
//             noWrap
//             sx={{
//               flexGrow: 1,
//               maxWidth: { xs: 'calc(100% - 70px)', sm: 'calc(100% - 100px)' },
//               fontSize: { xs: '0.7rem', sm: '0.8rem' }
//             }}
//           >
//             {files[0].name} {/* ✅ Correct file name */}
//           </Typography>

//           {/* Preview & Remove */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//              <Box
//               component='img'
//               src={files[0].preview}
//               alt={files[0].name}
//               sx={{
//                 height: 30,
//                 width: 30,
//                 borderRadius: 1,
//                 objectFit: 'cover'
//               }}
//             />
//             <i
//               className='tabler-x'
//               onClick={handleRemoveFile}
//               style={{
//                 fontSize: 16,
//                 cursor: 'pointer',
//                 color: theme.palette.error.main
//               }}
//             />
//           </Box>
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: 0.6
//           }}
//         >
//           <Avatar
//             variant='rounded'
//             sx={{
//               height: 20,
//               width: 20,
//               backgroundColor: theme.palette.action.focus
//             }}
//           >
//             <i className='tabler-upload' style={{ fontSize: 12 }} />
//           </Avatar>
//           <Typography
//             variant='caption'
//             color='text.secondary'
//             sx={{
//               whiteSpace: 'nowrap',
//               fontSize: { xs: '0.7rem', sm: '0.75rem' }
//             }}
//           >
//             Click or Drag file to upload
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default FileUploaderSingle


'use client'

import { useCallback } from 'react'

 import Avatar from '@mui/material/Avatar'
import { useDropzone } from 'react-dropzone'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const FileUploaderSingle = ({ label = '', onFileChange }) => {
  const theme = useTheme()

  const onDrop = useCallback(

    acceptedFiles => {
      if (acceptedFiles.length > 0) {
        // Pass the actual File object
        onFileChange(acceptedFiles[0])
      }
    },
    [onFileChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop
  })

  return (
 <Box
  {...getRootProps()}
  sx={{
    border: '1px solid',
    textAlign: 'center',
    borderRadius: 1,
    cursor: 'pointer',
    display: 'flex',              // ✅ keep flex layout
    flexDirection: 'row',         // ✅ side by side (avatar + text)
    alignItems: 'center',         // ✅ vertically center
    justifyContent: 'center',     // ✅ horizontally center
    gap: 1,                       // ✅ spacing between avatar & text
    p: 1                          // ✅ small padding
  }}
>
  <input {...getInputProps()} />

  <Avatar
    variant='rounded'
    sx={{
      height: 30,
      width: 30,
      backgroundColor: theme.palette.action.focus
    }}
  >
    <i className='tabler-upload' style={{ fontSize: 16 }} />
  </Avatar>

  <Typography variant="caption">
    { ' Click or Drag file to upload' }
  </Typography>
</Box>


  )
}

export default FileUploaderSingle
