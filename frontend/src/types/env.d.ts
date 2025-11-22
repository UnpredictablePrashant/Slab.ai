/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_SERVICE_URL: string
  readonly VITE_PAYMENT_SERVICE_URL: string
  readonly VITE_USER_SERVICE_URL: string
  readonly VITE_RAZORPAY_KEY_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
