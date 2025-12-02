// // src/utils/onesignal.js


// export const initOneSignal = () => {
//   if (typeof window === 'undefined') return

//   window.OneSignal = window.OneSignal || []
//   OneSignal.push(() => {
//     OneSignal.init({
//       app_id: '2c7b6ecf-6a7e-42b7-bfda-fdf47bf5c752', // replace with your app ID
//       notifyButton: { enable: true }, // hides bell icon
//       allowLocalhostAsSecureOrigin: true,
//     })

//     // Get Player ID and save it via your API helper
//     OneSignal.getUserId().then(async (player_id) => {
//       if (player_id) {
//         try {
//           await savePlayer({ player_id })
//           console.log('OneSignal Player ID saved:', player_id)
//         } catch (err) {
//           console.error('Failed to save Player ID:', err)
//         }
//       }
//     })
//   })
// }
