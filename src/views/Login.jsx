'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { showToast } from '@/components/common/Toasts.jsx'
import SwiperLoop from '@/components/SwiperLoop'


// react-hook-form & valibot
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, minLength, nonEmpty, object, pipe, string } from 'valibot'

// MUI
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Custom components / utils in your project
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import { getLocalizedUrl } from '@/utils/i18n'
import classnames from 'classnames'

// Swiper (right side visuals)
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

// API + token helper (you already had these in your project)
import { adminLoginApi } from '@/api/auth/login'
import { saveTokens } from '@/utils/tokenUtils'
import { signIn } from 'next-auth/react'

// ---------------- Styled helpers used in your previous login file ----------------
const LoginIllustration = styled('img')(({ theme }) => ({
  position: 'relative',
  zIndex: 5,
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
  zIndex: 0
})

// ---------------- Validation Schema ----------------
const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

// ---------------- Main Component ----------------
export default function LoginWithTabs() {
  const theme = useTheme()
  const router = useRouter()
  const { lang: locale } = useParams()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // tab: 0 = Dealer Admin, 1 = Manager, 2 = Sales Rep
  const [tab, setTab] = useState(0)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  // form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: { email: '', password: '' }
  })

  useEffect(() => {
    // remove redirectTo param if present (same as your previous file)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.has('redirectTo')) {
        router.replace(`/${locale}/login`)
      }
    }
  }, [locale, router])

  const handleClickShowPassword = () => setIsPasswordShown(s => !s)

  // map tab to role string we send to backend
  const roleMap = ['dealer', 'manager', 'sales']
  const selectedRole = roleMap[tab] || 'dealer'

  const onSubmit = async formData => {
    setLoading(true)
    setErrorMsg(null)

    try {
      // payload: include role so backend can distinguish if needed
      const payload = {
        email: formData.email,
        password: formData.password,
        role: selectedRole
      }

      const apiResponse = await adminLoginApi(payload)
      // console.log('API response', apiResponse)

      if (apiResponse?.status !== 'success') {
        const msg = apiResponse?.message || 'Login failed'
        showToast('error', msg)
        throw new Error(msg)
      }

      const userData = apiResponse.data || {}
      const accessToken = userData.access
      const refreshToken = userData.refresh

      if (!accessToken) {
        showToast('error', 'No access token returned from backend')
        throw new Error('No access token returned')
      }

      // save tokens + user
      saveTokens({ access: accessToken, refresh: refreshToken, user: userData })

      // create NextAuth session (if you use credentials provider)
      const signInResponse = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        apiToken: accessToken,
        redirect: false
      })

      if (signInResponse?.error) {
        showToast('error', 'Session creation failed')
        throw new Error(signInResponse.error)
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('active', 'true')
      }

      showToast('success', 'Login successful!')
      router.replace(getLocalizedUrl('/dashboard', locale))
    } catch (err) {
      // normalize message
      const msg = err?.response?.data?.message || err.message || 'Invalid email or password.'
      setErrorMsg(msg)
      showToast('error', msg)
      console.error('Login error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-between items-stretch'>
      {/* LEFT: form area (keeps your original left layout look) */}
      <div className='w-1/2 relative bg-white px-16 flex'>
        <div className='max-w-[820px] w-full pt-[120px] pb-10'>
          <Link href={getLocalizedUrl('/', locale)} className='absolute top-6 left-8'>
            <img
              src='/images/MotorMatchMainLogo.png'
              alt='Motor Match Logo'
              width={260}
              className='object-contain mt-4'
            />
          </Link>

          <Typography component='h3' variant='h2' className='mb-6 font-semibold text-black'>
            Sign in
          </Typography>

          {/* TABS */}
          <div className='flex bg-[#F7F7F8] p-1 rounded-xl mb-8 w-full max-w-[560px]'>
            {['Dealer Admin', 'Manager', 'Sales Rep'].map((label, index) => (
              <button
                key={index}
                onClick={() => setTab(index)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${tab === index ? 'bg-[#333333] text-white' : 'text-[#333]'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4 w-full max-w-[560px]'
          >
            {/* ID field (readonly) */}
            <CustomTextField
              className='mt-2'
              fullWidth
              label={tab === 0 ? 'Dealer ID' : tab === 1 ? 'Manager ID' : 'Sales Rep ID'}
              value='MM-ABC-2025'
            />

            {/* Email */}
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='email'
                  label='E-mail'
                  placeholder='hello@gmail.com'
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
                  id='form-password'
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
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
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

            <div className='flex items-center justify-between mb-2 mt-2'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography className='cursor-pointer text-sm text-gray-500'>
                <Link href={getLocalizedUrl('/forgot-password', locale)}>Forgot password ?</Link>
              </Typography>
            </div>

            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ backgroundColor: '#333333', borderRadius: '60px', paddingBlock: '10px' }}
              type='submit'
              disabled={loading}
            >
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

      {/* RIGHT: Swiper visuals — hidden on small screens (keeps original look) */}
      {/* RIGHT: Slider visuals — hidden on small screens */}
      {!hidden && (
        <div className='hidden lg:flex w-1/2 p-4 mt-6'>
          <div className='relative w-full h-[90vh] rounded-3xl overflow-hidden'>
            {/* Keen Slider */}
            <SwiperLoop />
          </div>
        </div>
      )}
    </div>
  )
}
