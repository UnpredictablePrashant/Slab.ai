type AppConfig = {
  projectServiceUrl: string
  paymentServiceUrl: string
  userServiceUrl: string
  razorpayKey: string
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

const ensureEnv = (value: string | undefined, key: keyof ImportMetaEnv): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return trimTrailingSlash(value)
}

const config: AppConfig = {
  projectServiceUrl: ensureEnv(import.meta.env.VITE_PROJECT_SERVICE_URL, 'VITE_PROJECT_SERVICE_URL'),
  paymentServiceUrl: ensureEnv(import.meta.env.VITE_PAYMENT_SERVICE_URL, 'VITE_PAYMENT_SERVICE_URL'),
  userServiceUrl: ensureEnv(import.meta.env.VITE_USER_SERVICE_URL, 'VITE_USER_SERVICE_URL'),
  razorpayKey: ensureEnv(import.meta.env.VITE_RAZORPAY_KEY_ID, 'VITE_RAZORPAY_KEY_ID'),
}

export const apiRoutes = {
  projects: `${config.projectServiceUrl}/api/projects`,
  projectDomains: `${config.projectServiceUrl}/api/projectdomain`,
  userLeads: `${config.userServiceUrl}/api/userleads`,
  payment: {
    create: `${config.paymentServiceUrl}/api/payment/create-order`,
    verify: `${config.paymentServiceUrl}/api/payment/verify-payment`,
    downloadLinks: `${config.paymentServiceUrl}/api/payment/send-download-links`,
  },
  admin: {
    summary: `${config.projectServiceUrl}/api/admin/summary`,
    projects: `${config.projectServiceUrl}/api/admin/projects`,
    login: `${config.projectServiceUrl}/api/admin/login`,
  },
}

export default config
