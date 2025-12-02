'use client'

import { useEffect } from 'react'

import { toast } from 'react-toastify'

import axiosInstance from '@/utils/token' // your API config

const updatePlayerId = async payload => {
  const res = await axiosInstance.post('api/save-player/', payload)

  return res.data?.data || res.data || {}
}

const sendTestNotification = async () => {
  const res = await axiosInstance.get('api/test-notification/')

  return res.data?.data || res.data || {}
}

const OneSignalProvider = ({ employeeId }) => {
  useEffect(() => {
    const setupOneSignal = async () => {
      try {
        // Load OneSignal SDK dynamically
        const script = document.createElement('script')

        script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
        script.async = true
        document.head.appendChild(script)

        script.onload = () => {
          window.OneSignal = window.OneSignal || []
          window.OneSignal.push(function () {
            // Initialize OneSignal
            window.OneSignal.init({
              app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
              notifyButton: { enable: true },
              allowLocalhostAsSecureOrigin: true
            })

            // Listen to subscription changes
            window.OneSignal.on('subscriptionChange', async isSubscribed => {
              if (isSubscribed) {
                const playerId = await window.OneSignal.getUserId()

                if (playerId) {
                  console.log('Subscribed! Player ID:', playerId)
                  await updatePlayerId({ player_id: playerId, employee_id: employeeId })
                  toast.success('✅ Notifications enabled!')
                  await sendTestNotification()
                }
              } else {
                console.log('User unsubscribed or blocked notifications.')
                toast.info('🔔 Notifications turned off.')
              }
            })
          })
        }
      } catch (err) {
        console.error('OneSignal setup failed:', err)
      }
    }

    if (typeof window !== 'undefined') setupOneSignal()
  }, [employeeId])

  return null
}

export default OneSignalProvider
