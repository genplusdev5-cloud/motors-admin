'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { showToast } from '@/components/common/Toasts.jsx'

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

import { adminLoginApi } from '@/api/auth/login'

// ←------ ADDED: import saveTokens
import { saveTokens } from '@/utils/tokenUtils'

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

// -------------------- Component --------------------

const Login = ({ mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // Remove redirectTo query if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('redirectTo')) {
      router.replace(`/${locale}/login`)
    }
  }, [locale, router])

  // Images
  // Images
  const authBackground = useImageVariant(mode, '/images/pages/auth-mask-light.png', '/images/pages/car-image.png')

  const characterIllustration = useImageVariant(
    mode,
    '/images/illustrations/auth/car-imageLogin.png',
    '/images/illustrations/auth/car-imageLogin.png',
    '/images/illustrations/auth/v2-login-light-border.png',
    '/images/illustrations/auth/v2-login-dark-border.png'
  )

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: { email: '', password: '' }
  })

  const handleClickShowPassword = () => setIsPasswordShown(s => !s)

  const onSubmit = async formData => {
    setLoading(true)
    setErrorMsg(null)

    try {
      // 1) Call backend login API
      const apiResponse = await adminLoginApi({
        email: formData.email,
        password: formData.password
      })

      console.log('🟢 API RAW RESPONSE:', apiResponse)

      if (apiResponse.status !== 'success') {
        showToast('error', apiResponse.message || 'Login failed')
        throw new Error(apiResponse.message || 'Login failed')
      }

      const userData = apiResponse.data || {}
      const accessToken = userData.access
      const refreshToken = userData.refresh

      if (!accessToken) {
        showToast('error', 'No access token returned from backend')
        throw new Error('No access token returned from backend')
      }

      // 2) Save tokens locally — use object-style call so we also persist user
      saveTokens({ access: accessToken, refresh: refreshToken, user: userData })

      // 3) Create NextAuth session
      const signInResponse = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        apiToken: accessToken,
        redirect: false
      })

      if (signInResponse?.error) {
        console.error('NextAuth sign-in error:', signInResponse.error)
        showToast('error', 'Session creation failed')
        throw new Error('Session creation failed')
      }

      // 4) Mark active session in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('active', 'true')
      }

      // 5) Success toast + redirect
      showToast('success', 'Login successful! Redirecting...')
      router.replace(getLocalizedUrl('/dashboard', locale))
    } catch (err) {
      console.error('❌ Login failed:', err)
      const msg = err?.response?.data?.message || err.message || 'Invalid email or password.'
      setErrorMsg(msg)
      showToast('error', msg)
    } finally {
      setLoading(false)
    }
  }

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
            {/* Email */}
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
                  placeholder='admin@motormatch.com'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* Password */}
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
