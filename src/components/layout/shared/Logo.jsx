// 'use client'

// // React Imports
// import { useEffect, useRef } from 'react'

// // Third-party Imports
// import styled from '@emotion/styled'

// // Component Imports
// import VuexyLogo from '@core/svg/Logo'

// // Config Imports
// import themeConfig from '@configs/themeConfig'

// // Hook Imports
// import useVerticalNav from '@menu/hooks/useVerticalNav'
// import { useSettings } from '@core/hooks/useSettings'

// const LogoText = styled.span`
//   color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
//   font-size: 1.375rem;
//   line-height: 1.09091;
//   font-weight: 700;
//   letter-spacing: 0.25px;
//   transition: ${({ transitionDuration }) =>
//     `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

//   ${({ isHovered, isCollapsed, isBreakpointReached }) =>
//     !isBreakpointReached && isCollapsed && !isHovered
//       ? 'opacity: 0; margin-inline-start: 0;'
//       : 'opacity: 1; margin-inline-start: 12px;'}
// `

// const Logo = ({ color }) => {
//   // Refs
//   const logoTextRef = useRef(null)

//   // Hooks
//   const { isHovered, transitionDuration, isBreakpointReached } = useVerticalNav()
//   const { settings } = useSettings()

//   // Vars
//   const { layout } = settings

//   useEffect(() => {
//     if (layout !== 'collapsed') {
//       return
//     }

//     if (logoTextRef && logoTextRef.current) {
//       if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
//         logoTextRef.current?.classList.add('hidden')
//       } else {
//         logoTextRef.current.classList.remove('hidden')
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isHovered, layout, isBreakpointReached])

//   return (
//     <div className='flex items-center'>
//       <VuexyLogo className='text-2xl text-primary' />
//       <LogoText
//         color={color}
//         ref={logoTextRef}
//         isHovered={isHovered}
//         isCollapsed={layout === 'collapsed'}
//         transitionDuration={transitionDuration}
//         isBreakpointReached={isBreakpointReached}
//       >
//         {themeConfig.templateName}
//       </LogoText>
//     </div>
//   )
// }

// export default Logo





'use client'

import Image from 'next/image'

import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

import useVerticalNav from '@menu/hooks/useVerticalNav'

const LogoWithText = () => {
  const { isCollapsed, isHovered } = useVerticalNav()
  const theme = useTheme()
  const isMini = isCollapsed && !isHovered

  // Full logo (light/dark)
  const lightLogo = '/images/MotorMatchMainLogo.png'
  const darkLogo = '/images/motormatch-lightlogo.png'
  const fullLogoSrc = theme.palette.mode === 'dark' ? darkLogo : lightLogo

  // Mini logo (light/dark)
  const miniLogoLight = '/images/logo.png'
  const miniLogoDark = '/images/logoWhite.png'
  const miniLogoSrc = theme.palette.mode === 'dark' ? miniLogoDark : miniLogoLight

  // Sizes
  const logoWidth = isMini ? 40 : 180
  const logoHeight = isMini ? 40 : 40

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        width: logoWidth,
        height: logoHeight,
        minWidth: logoWidth,
        minHeight: logoHeight,
        flexShrink: 0
      }}
    >
      <Image
        src={isMini ? miniLogoSrc : fullLogoSrc}
        alt='MotorMatch Logo'
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
      {!isMini && (
        <Box sx={{ ml: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: theme.palette.text.primary }}></span>
        </Box>
      )}
    </Box>
  )
}

export default LogoWithText

