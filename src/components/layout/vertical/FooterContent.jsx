'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='#2137a5ff'>{`© ${new Date().getFullYear()}, Made with `}</span>
        <span>{`❤️`}</span>
        <span className='#2137a5ff'>{` by `}</span>
        <Link href='' target='_blank' className='#2137a5ff'>
          MOTOR MATCH
        </Link>
      </p>
      {/* {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <Link href='https://themeforest.net/licenses/standard' target='_blank' className='text-primary'>
            License
          </Link>
          <Link href='https://themeforest.net/user/pixinvent/portfolio' target='_blank' className='text-primary'>
            More Themes
          </Link>
          <Link
            href='https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation'
            target='_blank'
            className='text-primary'
          >
            Documentation
          </Link>
          <Link href='https://pixinvent.ticksy.com' target='_blank' className='text-primary'>
            Support
          </Link>
        </div>
      )} */}
    </div>
  )
}

export default FooterContent







// ------------------------------------------------------------------------------

// 'use client'

// import { useEffect } from 'react'

// import Link from 'next/link'

// import classnames from 'classnames'
// import { toast } from 'react-toastify'

// import useVerticalNav from '@menu/hooks/useVerticalNav'
// import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'



// const FooterContent = () => {
//   const { isBreakpointReached } = useVerticalNav()

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         // 🔹 1️⃣ First: Save player immediately (Placeholder or initial register)
//         const playerSaveResponse = await playerId({ player_id: '', employee_id: '' })

//         console.log('✅ Initial Player Save Response:', playerSaveResponse)

//         // 🔹 2️⃣ Then: Fetch OneSignal keys
//         const keys = await getNotificationKeys()

//         console.log('Notification Keys:', keys)

//         // 🔹 3️⃣ Load OneSignal SDK dynamically
//         if (typeof window !== 'undefined' && !window.OneSignal) {
//           const script = document.createElement('script')

//           script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
//           script.async = true
//           document.head.appendChild(script)

//           script.onload = async () => {
//             window.OneSignal = window.OneSignal || []
//             window.OneSignal.push(async function () {
//               // 🔹 4️⃣ Initialize OneSignal
//               window.OneSignal.init({
//                 app_id: keys?.app_id || '2c7b6ecf-6a7e-42b7-bfda-fdf47bf5c752',
//                 notifyButton: { enable: true },
//                 allowLocalhostAsSecureOrigin: true,
//                 serviceWorkerPath: '/OneSignalSDKWorker.js',
//                 serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js'
//               })

//               // 🔹 5️⃣ Check if user already subscribed
//               const isSubscribed = await window.OneSignal.isPushNotificationsEnabled()

//               if (isSubscribed) {
//                 const playerIdValue = await window.OneSignal.getUserId()

//                 if (playerIdValue) {
//                   const updateResponse1 = await playerId({ player_id: playerIdValue, employee_id: '' })

//                   console.log('✅ Update Player ID (Subscribed) Response:', updateResponse1)
//                   toast.success('✅ Player ID updated with OneSignal value!')

//                   // NOTE: sendNotification removed here to prevent an immediate, potentially unwanted push.
//                 }
//               }

//               // 🔹 6️⃣ Listen for subscription changes
//               window.OneSignal.on('subscriptionChange', async function (isSubscribed) {
//                 if (isSubscribed) {
//                   const data = await window.OneSignal.getUserId()

//                   if (data) {
//                     const updateResponse2 = await playerId({ player_id: data, employee_id: '' })

//                     console.log('✅ Update Player ID (New Subscription) Response:', updateResponse2)
//                     toast.success('✅ Notification subscription linked!')


//                   }
//                 } else {
//                   console.log('User unsubscribed or blocked notifications.')
//                   toast.info('🔔 Notifications turned off.')
//                 }
//               })
//             })
//           }
//         }
//       } catch (err) {
//         console.error('❌ Error during initialization:', err)
//         toast.error('❌ Something went wrong during notification setup.')
//       }
//     }

//     initialize()
//   }, [])

//   return (
//     <div
//       className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
//     >
//       <p>
//         <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Made with `}</span>
//         <span>{`❤️`}</span>
//         <span className='text-textSecondary'>{` by `}</span>
//         <Link href='https://pixinvent.com' target='_blank' className='text-primary uppercase'>
//           MOTOR MATCH
//         </Link>
//       </p>
//       {!isBreakpointReached && <div className='flex items-center gap-4'></div>}
//     </div>
//   )
// }

// export default FooterContent
