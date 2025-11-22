import { useEffect, useState } from 'react'

export const useRazorpay = () => {
  const [ready, setReady] = useState<boolean>(Boolean(window.Razorpay))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (window.Razorpay) {
      setReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setReady(true)
    script.onerror = () => setError('Unable to load Razorpay checkout. Please retry.')
    document.body.appendChild(script)
  }, [])

  return { ready, error }
}
