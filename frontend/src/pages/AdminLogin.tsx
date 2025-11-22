import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { NotificationStack } from '../components/NotificationStack'
import { useNotifications } from '../hooks/useNotifications'
import { adminApi } from '../lib/api'
import { clearAdminToken, getAdminToken, setAdminToken } from '../lib/auth'

export const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { notifications, push, dismiss } = useNotifications()
  const navigate = useNavigate()
  const existingToken = getAdminToken()

  if (existingToken) {
    return <Navigate to="/admin/projects" replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    clearAdminToken()
    try {
      const response = await adminApi.login(email.trim(), password)
      setAdminToken(response.token)
      push('Signed in as admin', 'success')
      navigate('/admin/projects')
    } catch (error) {
      push(error instanceof Error ? error.message : 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <NotificationStack notifications={notifications} onDismiss={dismiss} />
      <header className="page-header">
        <p className="eyebrow">Admin access</p>
        <h1>Sign in to manage projects</h1>
        <p className="muted">Use the admin credentials configured in the backend .env file.</p>
      </header>

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <button type="button" className="ghost" onClick={() => navigate('/')}>
            Back to site
          </button>
        </div>
      </form>
    </div>
  )
}
