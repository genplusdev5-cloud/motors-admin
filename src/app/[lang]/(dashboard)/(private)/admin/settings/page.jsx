'use client'

import { useState, useMemo } from 'react'

import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

// Assuming these are custom components from your project
// NOTE: These components must exist in your project for this code to run successfully.
import CustomTextField from '@core/components/mui/TextField'

// Data and Labels
const tabLabels = ['Email Settings', 'SMS Settings', 'Payment Settings']

// ----------------------------------------------------------------------
// 💡 NESTED PANEL COMPONENT (for Sandbox/Live content)
// ----------------------------------------------------------------------

const EnvironmentPanel = ({ children, value, index }) => (
  <div role='tabpanel' hidden={value !== index} id={`env-tabpanel-${index}`} aria-labelledby={`env-tab-${index}`}>
    {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
  </div>
)

// ----------------------------------------------------------------------
// TAB CONTENT COMPONENTS (FORMS)
// ----------------------------------------------------------------------

const EmailSettings = () => {
  const [activeEnvTab, setActiveEnvTab] = useState(0) // 0 for Sandbox/Test, 1 for Live/Production

  // --- Form Data for Sandbox/Test Environment ---
  const [sandboxFormData, setSandboxFormData] = useState({
    smtpHost: 'sandbox.smtp.net',
    smtpPort: '587',
    clientSecretKey: 'SANDBOX_SECRET_123',
    senderEmail: 'test@example.com',
    smtpUsername: 'sandbox_user',
    smtpPassword: '', // Masked input
    isEnabled: true
  })

  // --- Form Data for Live/Production Environment ---
  const [liveFormData, setLiveFormData] = useState({
    smtpHost: 'live.smtp.net',
    smtpPort: '587',
    clientSecretKey: 'LIVE_SECRET_456',
    senderEmail: 'noreply@yourdomain.com',
    smtpUsername: 'live_user',
    smtpPassword: '', // Masked input
    isEnabled: false
  })

  const handleChange = (field, value, isLive) => {
    if (isLive) {
      setLiveFormData(prev => ({ ...prev, [field]: value }))
    } else {
      setSandboxFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = isLive => {
    const dataToSave = isLive ? liveFormData : sandboxFormData

    console.log(`Saving ${isLive ? 'Live' : 'Sandbox'} Email Settings:`, dataToSave)
    alert(`${isLive ? 'Live' : 'Sandbox'} Email settings saved!`)
  }

  const renderForm = (formData, isLive) => (
    <>
      <Grid container spacing={5}>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Host'
            fullWidth
            value={formData.smtpHost}
            onChange={e => handleChange('smtpHost', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Port No.'
            fullWidth
            type='number'
            value={formData.smtpPort}
            onChange={e => handleChange('smtpPort', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Client SecretKey'
            fullWidth
            type='password'
            value={formData.clientSecretKey}
            onChange={e => handleChange('clientSecretKey', e.target.value, isLive)}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Sender Email Address'
            fullWidth
            value={formData.senderEmail}
            onChange={e => handleChange('senderEmail', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Username'
            fullWidth
            value={formData.smtpUsername}
            onChange={e => handleChange('smtpUsername', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Password'
            fullWidth
            type='password'
            value={formData.smtpPassword}
            onChange={e => handleChange('smtpPassword', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isEnabled}
                onChange={e => handleChange('isEnabled', e.target.checked, isLive)}
                name='isEnabled'
              />
            }
            label={`${isLive ? 'Live' : 'Sandbox'} Email Sending ${formData.isEnabled ? 'Enabled' : 'Disabled'}`}
          />
        </Grid>
      </Grid>
      <Button variant='contained' onClick={() => handleSave(isLive)} sx={{ mt: 5 }}>
        Save {isLive ? 'Live' : 'Sandbox'} Email Settings
      </Button>
    </>
  )

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h6' gutterBottom sx={{ mb: 3 }}>
        Email Configuration
      </Typography>

      <Tabs
        value={activeEnvTab}
        onChange={(e, newValue) => setActiveEnvTab(newValue)}
        indicatorColor='primary'
        textColor='primary'
        sx={{ mb: 0 }}
      >
        <Tab label='Sandbox/Test' id='env-tab-0' aria-controls='env-tabpanel-0' />
        <Tab label='Live/Production' id='env-tab-1' aria-controls='env-tabpanel-1' />
      </Tabs>
      <Divider sx={{ mb: 0 }} />

      <EnvironmentPanel value={activeEnvTab} index={0}>
        {renderForm(sandboxFormData, false)}
      </EnvironmentPanel>
      <EnvironmentPanel value={activeEnvTab} index={1}>
        {renderForm(liveFormData, true)}
      </EnvironmentPanel>
    </Box>
  )
}

const SmsSettings = () => {
  const [activeEnvTab, setActiveEnvTab] = useState(0) // 0 for Sandbox/Test, 1 for Live/Production

  // --- Form Data for Sandbox/Test Environment ---
  const [sandboxFormData, setSandboxFormData] = useState({
    providerName: 'Twilio (Test)',
    apiUrl: 'https://api.test.twilio.com/...',
    apiKey: 'TEST_SK123...',
    senderId: '+1501712266',
    apiSecret: '', // Masked input
    templateId: 'SMS_TEST_101',
    message: 'Test message for sandbox env: {message}',
    isEnabled: true
  })

  // --- Form Data for Live/Production Environment ---
  const [liveFormData, setLiveFormData] = useState({
    providerName: 'Twilio (Live)',
    apiUrl: 'https://api.twilio.com/...',
    apiKey: 'LIVE_SK456...',
    senderId: '+1501712267',
    apiSecret: '', // Masked input
    templateId: 'SMS_LIVE_202',
    message: 'Your message is: {message}',
    isEnabled: false
  })

  const handleChange = (field, value, isLive) => {
    if (isLive) {
      setLiveFormData(prev => ({ ...prev, [field]: value }))
    } else {
      setSandboxFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = isLive => {
    const dataToSave = isLive ? liveFormData : sandboxFormData

    console.log(`Saving ${isLive ? 'Live' : 'Sandbox'} SMS Settings:`, dataToSave)
    alert(`${isLive ? 'Live' : 'Sandbox'} SMS settings saved!`)
  }

  const renderForm = (formData, isLive) => (
    <>
      <Grid container spacing={5}>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Provider Name'
            fullWidth
            value={formData.providerName}
            onChange={e => handleChange('providerName', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='API URL'
            fullWidth
            placeholder='e.g., https://api.twilio.com/...'
            value={formData.apiUrl}
            onChange={e => handleChange('apiUrl', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='API Key'
            fullWidth
            type='password'
            placeholder='Enter API Key'
            value={formData.apiKey}
            onChange={e => handleChange('apiKey', e.target.value, isLive)}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Sender ID'
            fullWidth
            value={formData.senderId}
            onChange={e => handleChange('senderId', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Auth Token'
            fullWidth
            type='password'
            placeholder='Enter Auth Token'
            value={formData.apiSecret}
            onChange={e => handleChange('apiSecret', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Template ID'
            fullWidth
            value={formData.templateId}
            onChange={e => handleChange('templateId', e.target.value, isLive)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} mt={3}>
          <CustomTextField
            label='Message'
            fullWidth
            multiline
            rows={2}
            value={formData.message}
            onChange={e => handleChange('message', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} mt={10} ml={5}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isEnabled}
                onChange={e => handleChange('isEnabled', e.target.checked, isLive)}
                name='isEnabled'
              />
            }
            label={`${isLive ? 'Live' : 'Sandbox'} SMS Sending ${formData.isEnabled ? 'Enabled' : 'Disabled'}`}
          />
        </Grid>

        <Grid xs={12}></Grid>
      </Grid>
    </>
  )

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h6' gutterBottom sx={{ mb: 3 }}>
        SMS Gateway Setup
      </Typography>

      <Tabs
        value={activeEnvTab}
        onChange={(e, newValue) => setActiveEnvTab(newValue)}
        indicatorColor='primary'
        textColor='primary'
        sx={{ mb: 0 }}
      >
        <Tab label='Sandbox/Test' id='env-tab-0' aria-controls='env-tabpanel-0' />
        <Tab label='Live/Production' id='env-tab-1' aria-controls='env-tabpanel-1' />
      </Tabs>
      <Divider sx={{ mb: 0 }} />

      <EnvironmentPanel value={activeEnvTab} index={0}>
        {renderForm(sandboxFormData, false)}
      </EnvironmentPanel>
      <EnvironmentPanel value={activeEnvTab} index={1}>
        {renderForm(liveFormData, true)}
      </EnvironmentPanel>
    </Box>
  )
}

const PaymentSettings = () => {
  const [activeEnvTab, setActiveEnvTab] = useState(0)

  // --- Form Data for Sandbox/Test Environment ---
  const [sandboxFormData, setSandboxFormData] = useState({
    primaryGateway: 'Stripe',
    currencyCode: 'USD',
    merchantId: 'M_TEST_123',
    clientId: 'C_TEST_123',
    clientSecretKey: 'CS_TEST_123',
    webhookSecret: 'WH_TEST_123',
    baseUrl: 'https://api.test.stripe.com',
    callbackUrl: 'https://app.com/callback/test',
    isEnabled: true
  })

  // --- Form Data for Live/Production Environment ---
  const [liveFormData, setLiveFormData] = useState({
    primaryGateway: 'Stripe',
    currencyCode: 'INR',
    merchantId: 'M_LIVE_456',
    clientId: 'C_LIVE_456',
    clientSecretKey: 'CS_LIVE_456',
    webhookSecret: 'WH_LIVE_456',
    baseUrl: 'https://api.stripe.com',
    callbackUrl: 'https://app.com/callback/live',
    isEnabled: false
  })

  const handleChange = (field, value, isLive) => {
    if (isLive) {
      setLiveFormData(prev => ({ ...prev, [field]: value }))
    } else {
      setSandboxFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSave = isLive => {
    const dataToSave = isLive ? liveFormData : sandboxFormData

    console.log(`Saving ${isLive ? 'Live' : 'Sandbox'} Payment Settings:`, dataToSave)
    alert(`${isLive ? 'Live' : 'Sandbox'} Payment settings saved!`)
  }

  const renderForm = (formData, isLive) => (
    <>
      <Grid container spacing={5}>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Gateway'
            fullWidth
            value={formData.primaryGateway}
            onChange={e => handleChange('primaryGateway', e.target.value, isLive)}
          ></CustomTextField>
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Currency Code'
            fullWidth
            value={formData.currencyCode}
            onChange={e => handleChange('currencyCode', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField label='Environment Status' fullWidth disabled value={isLive ? 'Live' : 'Test/Sandbox'} />
        </Grid>

        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Merchant ID'
            fullWidth
            type='password'
            value={formData.merchantId}
            onChange={e => handleChange('merchantId', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Client ID'
            fullWidth
            type='password'
            value={formData.clientId}
            onChange={e => handleChange('clientId', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Client Secret Key'
            fullWidth
            type='password'
            value={formData.clientSecretKey}
            onChange={e => handleChange('clientSecretKey', e.target.value, isLive)}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Webhook Secret'
            fullWidth
            type='password'
            value={formData.webhookSecret}
            onChange={e => handleChange('webhookSecret', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Base Url'
            fullWidth
            value={formData.baseUrl}
            onChange={e => handleChange('baseUrl', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} sm={4}>
          <CustomTextField
            label='Callback Url'
            fullWidth
            value={formData.callbackUrl}
            onChange={e => handleChange('callbackUrl', e.target.value, isLive)}
          />
        </Grid>
        <Grid xs={12} mt={4} ml={2}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isEnabled}
                onChange={e => handleChange('isEnabled', e.target.checked, isLive)}
                name='isEnabled'
              />
            }
            label={`${isLive ? 'Live' : 'Sandbox'} Payments ${formData.isEnabled ? 'Enabled' : 'Disabled'}`}
          />
        </Grid>
      </Grid>
      <Button variant='contained' onClick={() => handleSave(isLive)} sx={{ mt: 5 }}>
        Save {isLive ? 'Live' : 'Sandbox'} Payment Settings
      </Button>
    </>
  )

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant='h6' gutterBottom sx={{ mb: 3 }}>
        Payment Gateway Integration
      </Typography>

      <Tabs
        value={activeEnvTab}
        onChange={(e, newValue) => setActiveEnvTab(newValue)}
        indicatorColor='primary'
        textColor='primary'
        sx={{ mb: 0 }}
      >
        <Tab label='Sandbox/Test' id='env-tab-0' aria-controls='env-tabpanel-0' />
        <Tab label='Live/Production' id='env-tab-1' aria-controls='env-tabpanel-1' />
      </Tabs>
      <Divider sx={{ mb: 0 }} />

      <EnvironmentPanel value={activeEnvTab} index={0}>
        {renderForm(sandboxFormData, false)}
      </EnvironmentPanel>
      <EnvironmentPanel value={activeEnvTab} index={1}>
        {renderForm(liveFormData, true)}
      </EnvironmentPanel>
    </Box>
  )
}

// ----------------------------------------------------------------------
// MAIN SETTINGS COMPONENT
// ----------------------------------------------------------------------
const Settings = () => {
  const theme = useTheme()

  // STATE
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleOpenModal = () => console.log('Add button clicked: Open Modal to select config type.')

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <EmailSettings />
      case 1:
        return <SmsSettings />
      case 2:
        return <PaymentSettings />
      default:
        return null
    }
  }

  // ----------------------------------------------------------------------
  // COMPONENT RETURN
  // ----------------------------------------------------------------------
  return (
    <>
      <Card sx={{ p: '1.5rem' }}>
        {/* Header and Breadcrumbs */}
        <div
          style={{
            marginBottom: 10,
            paddingBottom: 10,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: theme.palette.text.primary }}>Settings</span>
          </div>

          <div
            style={{
              fontSize: 14,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Link href='/' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              <Box display='flex' alignItems='center' gap={1}>
                <i className='tabler-smart-home' style={{ fontSize: 20 }} />
              </Box>
            </Link>
            {' / '}
            <Link href='/masters' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Masters
            </Link>
            {' / '}
            <Link href='/fuel-type' style={{ textDecoration: 'none', color: theme.palette.text.primary }}>
              Settings
            </Link>
          </div>
        </div>
        {/* --- End Header --- */}

        {/* TOP-LEVEL TAB NAVIGATION (Email, SMS, Payment) - CENTERED */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          centered // This centers the main tabs
          sx={{ mb: 0 }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>

        <Divider sx={{ mb: 0 }} />

        {/* TAB CONTENT (Forms with Nested Env Tabs) */}
        {renderTabContent()}
      </Card>
    </>
  )
}

export default Settings
