interface RazorpayPrefill {
  name?: string
  email?: string
  contact?: string
}

interface RazorpayTheme {
  color?: string
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  image?: string
  order_id: string
  handler: (response: RazorpayHandlerResponse) => void | Promise<void>
  prefill?: RazorpayPrefill
  notes?: Record<string, string>
  theme?: RazorpayTheme
}

interface RazorpayInstance {
  open: () => void
  close: () => void
  on: (event: 'payment.failed', handler: (response: unknown) => void) => void
}

interface Window {
  Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
}
