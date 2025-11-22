import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { NotificationTone } from '../hooks/useNotifications'
import { leadApi } from '../lib/api'

interface Props {
  notify: (message: string, tone?: NotificationTone) => void
}

const defaultForm = {
  name: '',
  countryCode: '+91',
  phoneNo: '',
  email: '',
}

export const LeadForm = ({ notify }: Props) => {
  const [form, setForm] = useState({ ...defaultForm })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await leadApi.create(form)
      notify('Thanks for reaching out - we will get in touch shortly.', 'success')
      setForm({ ...defaultForm })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit the form right now.'
      notify(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card lead-form" onSubmit={handleSubmit} id="contact">
      <p className="eyebrow">Talk to us</p>
      <h3>Need help choosing a bundle?</h3>
      <p>Share your details and our team will recommend the right stack for your goals.</p>

      <label>
        Full name
        <input name="name" type="text" value={form.name} onChange={handleChange} required />
      </label>
      <div className="split">
        <label>
          Country code
          <input name="countryCode" type="text" value={form.countryCode} onChange={handleChange} required />
        </label>
        <label>
          Phone number
          <input name="phoneNo" type="tel" value={form.phoneNo} onChange={handleChange} required />
        </label>
      </div>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Request callback'}
      </button>
    </form>
  )
}
