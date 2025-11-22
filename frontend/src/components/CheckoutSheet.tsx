import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import config from '../config/env'
import { useRazorpay } from '../hooks/useRazorpay'
import type { NotificationTone } from '../hooks/useNotifications'
import { paymentApi } from '../lib/api'
import { formatCurrency } from '../lib/formatters'
import type { Project } from '../types/project'

interface Props {
  project: Project | null
  onClose: () => void
  onSuccess: (downloadLink: string) => void
  notify: (message: string, tone?: NotificationTone) => void
}

type CheckoutForm = {
  name: string
  email: string
  phone: string
}

const defaultForm: CheckoutForm = {
  name: '',
  email: '',
  phone: '',
}

export const CheckoutSheet = ({ project, onClose, onSuccess, notify }: Props) => {
  const [form, setForm] = useState<CheckoutForm>({ ...defaultForm })
  const [submitting, setSubmitting] = useState(false)
  const { ready, error } = useRazorpay()

  useEffect(() => {
    if (!project) {
      setForm({ ...defaultForm })
      setSubmitting(false)
    }
  }, [project])

  if (!project) return null

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ready || !window.Razorpay) {
      notify(error ?? 'Checkout is still preparing. Please retry in a second.', 'error')
      return
    }

    setSubmitting(true)
    const user = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      projectId: project._id,
      amount: project.pricing,
    }

    try {
      const order = await paymentApi.createOrder(project.pricing, user)

      const options: RazorpayOptions = {
        key: config.razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Slab.ai Projects',
        description: project.projectTitle,
        order_id: order.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: '#2563eb' },
        handler: async (response) => {
          try {
            const verification = await paymentApi.verifyPayment({
              orderCreationId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              user,
            })
            notify('Payment verified. Download link sent to your inbox.', 'success')
            onSuccess(verification.downloadLink)
            onClose()
          } catch (verifyError) {
            const message =
              verifyError instanceof Error ? verifyError.message : 'We could not verify this payment automatically.'
            notify(message, 'error')
          } finally {
            setSubmitting(false)
          }
        },
      }

      const checkout = new window.Razorpay(options)
      checkout.on('payment.failed', () => {
        notify('Payment attempt was declined. Please try again.', 'error')
        setSubmitting(false)
      })
      checkout.open()
    } catch (checkoutError) {
      const message =
        checkoutError instanceof Error ? checkoutError.message : 'Unable to start the checkout right now.'
      notify(message, 'error')
      setSubmitting(false)
    }
  }

  return (
    <div className="sheet-backdrop" role="dialog" aria-modal="true">
      <div className="sheet">
        <header>
          <div>
            <p className="eyebrow">Checkout</p>
            <h3>{project.projectTitle}</h3>
          </div>
          <button type="button" aria-label="Close checkout" onClick={onClose} disabled={submitting}>
            x
          </button>
        </header>

        <p className="price">{formatCurrency(project.pricing)}</p>

        <form className="sheet-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input name="name" type="text" placeholder="Elena Alvarez" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone
            <input
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>
          {!ready && <p className="helper">Preparing secure checkout...</p>}
          {error && <p className="helper error">{error}</p>}

          <button type="submit" disabled={submitting || !ready}>
            {submitting ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </form>
      </div>
    </div>
  )
}
