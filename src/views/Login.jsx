// 'use client'

// // React Imports
// import { useState } from 'react'

// // Next Imports
// import Link from 'next/link'
// import { useParams, useRouter } from 'next/navigation'

// // MUI Imports
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { styled, useTheme } from '@mui/material/styles'
// import Typography from '@mui/material/Typography'
// import IconButton from '@mui/material/IconButton'
// import InputAdornment from '@mui/material/InputAdornment'
// import Checkbox from '@mui/material/Checkbox'
// import Button from '@mui/material/Button'
// import FormControlLabel from '@mui/material/FormControlLabel'

// import { signIn } from "next-auth/react"

// // Third-party Imports
// import axios from 'axios'
// import { Controller, useForm } from 'react-hook-form'
// import { valibotResolver } from '@hookform/resolvers/valibot'
// import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
// import classnames from 'classnames'

// // Component Imports
// import { data } from 'autoprefixer'

// import Logo from '@components/layout/shared/Logo'
// import CustomTextField from '@core/components/mui/TextField'

// // Hook Imports
// import { useImageVariant } from '@core/hooks/useImageVariant'
// import { useSettings } from '@core/hooks/useSettings'

// // Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'

// const LOGIN_API_ENDPOINT = 'http://motor-match.genplusinnovations.com:7023/api/admin/login/'

// // Styled Components
// const LoginIllustration = styled('img')(({ theme }) => ({
//   zIndex: 2,
//   blockSize: 'auto',
//   maxBlockSize: 680,
//   maxInlineSize: '100%',
//   margin: theme.spacing(12),
//   [theme.breakpoints.down(1536)]: { maxBlockSize: 550 },
//   [theme.breakpoints.down('lg')]: { maxBlockSize: 450 }
// }))

// const MaskImg = styled('img')({
//   blockSize: 'auto',
//   maxBlockSize: 355,
//   inlineSize: '100%',
//   position: 'absolute',
//   insetBlockEnd: 0,
//   zIndex: -1
// })

// // Validation Schema
// const schema = object({
//   email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
//   password: pipe(
//     string(),
//     nonEmpty('This field is required'),
//     minLength(5, 'Password must be at least 5 characters long')
//   )
// })

// const Login = ({ mode }) => {
//   // States
//   const [isPasswordShown, setIsPasswordShown] = useState(false)
//   const [errorState, setErrorState] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [errorMsg, setErrorMsg] = useState(null)

//   // Vars
//   const lightImg = '/images/pages/auth-mask-light.png'
//   const darkImg = '/images/pages/car-image.png'
//   const lightIllustration = '/images/illustrations/auth/car-imageLogin.png'
//   const darkIllustration = '/images/illustrations/auth/car-imageLogin.png'
//   const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
//   const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

//   // Hooks
//   const router = useRouter()
//   const { lang: locale } = useParams()
//   const { settings } = useSettings()
//   const theme = useTheme()
//   const hidden = useMediaQuery(theme.breakpoints.down('md'))
//   const authBackground = useImageVariant(mode, lightImg, darkImg)

//   const effectiveLocale = locale ?? i18n.defaultLocale

//   const {
//     control,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     resolver: valibotResolver(schema),
//     defaultValues: {
//       email: '',
//       password: ''
//     }
//   })

//   const characterIllustration = useImageVariant(
//     mode,
//     lightIllustration,
//     darkIllustration,
//     borderedLightIllustration,
//     borderedDarkIllustration
//   )

//   // ✅ API Login Function
//   const handleClickShowPassword = () => setIsPasswordShown(s => !s)

//   const onSubmit = async data => {
//     setLoading(true)
//     setErrorMsg(null)

//     try {
//       // 1. Authenticate with your custom backend API
//       const apiResponse = await fetch(LOGIN_API_ENDPOINT, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           email: data.email,
//           password: data.password
//         }),
//         cache: 'no-store'
//       })

//       let apiData = null

//       try {
//         const text = await apiResponse.text()

//         apiData = text ? JSON.parse(text) : null
//       } catch (parseErr) {
//         console.warn('Login API returned non-JSON or empty response', parseErr)
//         apiData = null
//       }

//       if (!apiResponse.ok) {
//         const message =
//           apiData?.message || apiData?.error || `Invalid credentials or server error (status: ${apiResponse.status}).`

//         // --- CONSOLE LOG FOR API FAILURE ---
//         console.error('API Login FAILED:', message)

//         // ------------------------------------

//         setErrorMsg(message)
//         setLoading(false)

//         return
//       }

//       // --- CONSOLE LOG FOR API SUCCESS ---
//       // Extract token from possible response shapes: token, access, or nested data array
//       const possibleToken =
//         apiData?.token ||
//         apiData?.access ||
//         (Array.isArray(apiData?.data) && apiData.data[0]?.access) ||
//         apiData?.data?.access ||
//         null

//       const tokenToStore =
//         typeof possibleToken === 'string' &&
//         possibleToken !== 'undefined' &&
//         possibleToken !== 'null' &&
//         possibleToken.trim() !== ''
//           ? possibleToken
//           : null

//       if (tokenToStore) {
//         const masked = `${tokenToStore.slice(0, 8)}...${tokenToStore.slice(-6)}`

//         console.log('API Login SUCCESS. Token present (masked):', masked)

//         try {
//           sessionStorage.setItem('apiToken', tokenToStore)
//         } catch (e) {
//           console.warn('sessionStorage setItem failed:', e?.message || e)
//         }

//         // also set axios default header for convenience
//         try {
//           const axios = (await import('axios')).default

//           axios.defaults.headers.common['Authorization'] = `Bearer ${tokenToStore}`
//         } catch (err) {
//           console.warn('axios import/set header failed:', err?.message || err)
//         }
//       } else {
//         console.warn('API Login SUCCESS but no token found in response shape:', apiData)
//       }

//       // 2. Create NextAuth session with API token
//       const nextAuthSignInResponse = await signIn('credentials', {
//         email: data.email,
//         password: data.password,
//         apiToken: tokenToStore,
//         name: apiData?.user?.name || apiData?.data?.[0]?.name || data.email,
//         id: apiData?.user?.id || apiData?.user_id || apiData?.data?.[0]?.user_id || 11,
//         redirect: false
//       })

//       setLoading(false)

//       if (nextAuthSignInResponse && nextAuthSignInResponse.ok) {
//         // --- CONSOLE LOG FOR NEXTAUTH SUCCESS ---
//         console.log('NextAuth Session SUCCESS. Setting up API token.')

//         // ----------------------------------------

//         // Store the API token in memory for subsequent requests
//         if (typeof tokenToStore === 'string' && tokenToStore) {
//           try {
//             const axios = (await import('axios')).default

//             axios.defaults.headers.common['Authorization'] = `Bearer ${tokenToStore}`
//           } catch (err) {
//             console.warn('axios import/set header failed after signIn:', err?.message || err)
//           }

//           try {
//             sessionStorage.setItem('apiToken', tokenToStore)
//           } catch (e) {
//             /* ignore */
//           }
//         }

//         // 3. Redirect to the dashboard on successful sign-in
//         return router.replace(getLocalizedUrl('/en/dashboard', effectiveLocale))
//       } else {
//         // Handle NextAuth session creation error
//         const nextAuthErrorMsg =
//           nextAuthSignInResponse?.error || 'Authentication successful, but could not establish session.'

//         // --- CONSOLE LOG FOR NEXTAUTH FAILURE ---
//         console.error('NextAuth Session FAILED:', nextAuthErrorMsg)

//         // ------------------------------------------

//         setErrorMsg(nextAuthErrorMsg)
//       }
//     } catch (error) {
//       // --- CONSOLE LOG FOR NETWORK/GENERIC FAILURE ---
//       console.error('Login Network/Catch Block Error:', error)

//       // -----------------------------------------------

//       setErrorMsg('A network error occurred. Please try again.')
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='flex bs-full justify-center'>
//       {/* Left Illustration */}
//       <div
//         className={classnames(
//           'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
//           { 'border-ie': settings.skin === 'bordered' }
//         )}
//       >
//         <LoginIllustration src={characterIllustration} alt='character-illustration' />
//         {!hidden && <MaskImg alt='mask' src={authBackground} />}
//       </div>

//       {/* Right Form Side */}
//       <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
//         <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
//           <Logo />
//         </div>

//         <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
//           <div className='flex flex-col gap-1'>
//             <Typography variant='h4'>Welcome to MOTOR MATCH</Typography>
//           </div>

//           <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
//             {/* Email Field */}
//             <Controller
//               name='email'
//               control={control}
//               render={({ field }) => (
//                 <CustomTextField
//                   {...field}
//                   autoFocus
//                   fullWidth
//                   type='email'
//                   label='Email'
//                   value={data.email}
//                   placeholder='Enter your email'
//                   onChange={e => {
//                     field.onChange(e.target.value)
//                     errorState !== null && setErrorState(null)
//                   }}
//                   {...((errors.email || errorState !== null) && {
//                     error: true,
//                     helperText: errors?.email?.message || errorState?.message?.[0]
//                   })}
//                 />
//               )}
//             />

//             {/* Password Field */}
//             <Controller
//               name='password'
//               control={control}
//               render={({ field }) => (
//                 <CustomTextField
//                   {...field}
//                   fullWidth
//                   value={data.password}
//                   label='Password'
//                   placeholder='············'
//                   id='login-password'
//                   type={isPasswordShown ? 'text' : 'password'}
//                   onChange={e => {
//                     field.onChange(e.target.value)
//                     errorState !== null && setErrorState(null)
//                   }}
//                   slotProps={{
//                     input: {
//                       endAdornment: (
//                         <InputAdornment position='end'>
//                           <IconButton
//                             edge='end'
//                             onClick={handleClickShowPassword}
//                             onMouseDown={e => e.preventDefault()}
//                           >
//                             <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
//                           </IconButton>
//                         </InputAdornment>
//                       )
//                     }
//                   }}
//                   {...(errors.password && { error: true, helperText: errors.password.message })}
//                 />
//               )}
//             />

//             {/* Remember + Forgot */}
//             <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
//               <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
//               <Typography
//                 className='text-end'
//                 color='primary.main'
//                 component={Link}
//                 href={getLocalizedUrl('/forgot-password', locale)}
//               >
//                 Forgot password?
//               </Typography>
//             </div>

//             {/* Submit */}
//             <Button fullWidth variant='contained' type='submit'>
//               Login
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login

// --------------------------------------------------------------------------------------------

'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import classnames from 'classnames'

import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import { getLocalizedUrl } from '@/utils/i18n'

import axiosInstance, { setTokens } from '@/configs/token'

// -------------------- Styled Components --------------------
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12)
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

// -------------------- Validation Schema --------------------
const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

// -------------------- Main Component --------------------
const Login = ({ mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // -------------------- Image Paths --------------------
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkImg = '/images/pages/car-image.png'
  const lightIllustration = '/images/illustrations/auth/car-imageLogin.png'
  const darkIllustration = '/images/illustrations/auth/car-imageLogin.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  // -------------------- Image Variants --------------------
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  // -------------------- Form Setup --------------------
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: { email: '', password: '' }
  })

  const handleClickShowPassword = () => setIsPasswordShown(s => !s)

  // -------------------- Submit Handler --------------------
  const onSubmit = async formData => {
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await axiosInstance.post('admin/login/', {
        email: formData.email,
        password: formData.password
      })

      console.log('🟢 API RAW RESPONSE:', res.data)
      const data = res.data

      // Extract token safely
      let accessToken = data?.access || data?.token || data?.data?.access || data?.user?.apiToken || null

      if (!accessToken) {
        console.warn('⚠️ API returned no valid token')
      } else {
        setTokens(accessToken, null)
        console.log('✅ Token ready (masked):', `${accessToken.slice(0, 4)}...****`)
      }

      // NextAuth Sign In
      const signInResponse = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        apiToken: accessToken,
        redirect: false
      })

      if (signInResponse?.ok) {
        console.log('✅ NextAuth session created')
        router.replace(getLocalizedUrl('/en/dashboard', locale))
      } else {
        console.warn('⚠️ NextAuth failed — redirecting anyway')
        router.replace(getLocalizedUrl('/en/dashboard', locale))
      }
    } catch (err) {
      console.error('❌ Login failed:', err)
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  // -------------------- Render --------------------
  return (
    <div className='flex bs-full justify-center'>
      {/* Left Illustration */}
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          { 'border-ie': settings.skin === 'bordered' }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>

      {/* Right Form */}
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>

        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Welcome to MOTOR MATCH</Typography>
          </div>

          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            {/* Email Field */}
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='Enter your email'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            {/* Remember + Forgot */}
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale)}
              >
                Forgot password?
              </Typography>
            </div>

            {/* Submit */}
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            {errorMsg && (
              <Typography color='error' variant='body2' align='center'>
                {errorMsg}
              </Typography>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
