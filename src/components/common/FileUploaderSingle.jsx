import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useDropzone } from 'react-dropzone'

export default function FileUploaderSingle({ value, onChange }) {
  const [file, setFile] = useState(value || null)

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { 'image/*': [] },
    onDrop: acceptedFiles => {
      const selected = acceptedFiles[0]
      setFile(selected)
      onChange(selected)
    }
  })

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: '2px dashed ',
        borderRadius: '10px',
        height: 200,
        bgcolor: '#fafafa',
        cursor: 'pointer',
        transition: '0.2s ease',
        textAlign: 'center',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,

        '&:hover': {
          borderColor: '#6b5afd',
          backgroundColor: '#f4f2ff'
        }
      }}
    >
      <input {...getInputProps()} />

      {file ? (
        <>
          <img
            src={URL.createObjectURL(file)}
            alt='preview'
            style={{
              width: 90,
              height: 90,
              objectFit: 'cover',
              borderRadius: 8
            }}
          />
          <Typography sx={{ fontSize: '0.8rem', mt: 1 }}>{file.name}</Typography>
        </>
      ) : (
        <>
          <Avatar
            variant='rounded'
            sx={{
              width: 50,
              height: 50,
              bgcolor: '#e9e7ff',
              mb: 1
            }}
          >
            <i className='tabler-upload text-primary' />
          </Avatar>
          <Typography sx={{ fontWeight: 600, color: '#5e5873' }}>Drag & Drop your file here</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#6e6b7b' }}>or click to upload</Typography>
        </>
      )}
    </Box>
  )
}
