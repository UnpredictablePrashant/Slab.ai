import { useState } from 'react'
import type { FormEvent } from 'react'
import type { NotificationTone } from '../hooks/useNotifications'
import { paymentApi } from '../lib/api'

interface Props {
  notify: (message: string, tone?: NotificationTone) => void
}

export const DownloadForm = ({ notify }: Props) => {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const response = await paymentApi.sendDownloadLinks(email.trim())
      notify(response.message ?? 'Download links queued for delivery.', 'success')
      setEmail('')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to send download links for this email at the moment.'
      notify(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card download-form" onSubmit={handleSubmit}>
      <p className="eyebrow">Already purchased?</p>
      <h3>Resend your download links</h3>
      <p>Enter the email used during checkout, and we will resend every active download link.</p>

      <label>
        Email address
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Email my links'}
      </button>
    </form>
  )
}
