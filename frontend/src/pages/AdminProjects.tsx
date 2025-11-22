import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { NotificationStack } from '../components/NotificationStack'
import { useNotifications } from '../hooks/useNotifications'
import { adminApi, projectApi } from '../lib/api'
import { clearAdminToken, getAdminToken } from '../lib/auth'
import type { AdminSummary, Project, ProjectDomain } from '../types/project'

export const AdminProjects = () => {
  const token = getAdminToken()
  const navigate = useNavigate()
  const { notifications, push, dismiss } = useNotifications()
  const [domains, setDomains] = useState<ProjectDomain[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [summary, setSummary] = useState<AdminSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [creatingDomain, setCreatingDomain] = useState(false)
  const [form, setForm] = useState({
    projectTitle: '',
    description: '',
    pricing: '',
    projectDomain: '',
    keyWords: '',
  })
  const [domainForm, setDomainForm] = useState({ name: '', description: '' })

  const selectedDomainName = useMemo(
    () => domains.find((item) => item._id === form.projectDomain)?.name ?? '',
    [domains, form.projectDomain],
  )

  const totalKeywords = useMemo(
    () =>
      projects.reduce((acc, project) => {
        if (Array.isArray(project.keyWords)) return acc + project.keyWords.length
        return acc
      }, 0),
    [projects],
  )

  const handleAuthError = useCallback(
    (message: string) => {
      clearAdminToken()
      push(message || 'Session expired. Please sign in again.', 'error')
      navigate('/admin/login')
    },
    [navigate, push],
  )

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [domainData, projectData, summaryData] = await Promise.all([
        projectApi.domains(),
        adminApi.listProjects(),
        adminApi.summary(),
      ])
      setDomains(domainData)
      setProjects(projectData)
      setSummary(summaryData)
      if (!form.projectDomain && domainData.length) {
        setForm((prev) => ({ ...prev, projectDomain: domainData[0]._id }))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load admin data'
      if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('token')) {
        handleAuthError(message)
      } else {
        push(message, 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [form.projectDomain, handleAuthError, push])

  useEffect(() => {
    if (token) {
      load()
    }
  }, [load, token])

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  const handleCreateDomain = async (event: FormEvent) => {
    event.preventDefault()
    if (!domainForm.name.trim()) {
      push('Domain name is required', 'error')
      return
    }
    setCreatingDomain(true)
    try {
      const created = await adminApi.createDomain({
        name: domainForm.name.trim(),
        description: domainForm.description.trim(),
      })
      push('Domain added', 'success')
      setDomains((prev) => [created, ...prev])
      if (!form.projectDomain) {
        setForm((prev) => ({ ...prev, projectDomain: created._id }))
      }
      setDomainForm({ name: '', description: '' })
      setSummary((prev) => (prev ? { ...prev, totalDomains: prev.totalDomains + 1 } : prev))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create domain'
      if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('token')) {
        handleAuthError(message)
      } else {
        push(message, 'error')
      }
    } finally {
      setCreatingDomain(false)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const priceValue = Number(form.pricing)
    if (Number.isNaN(priceValue)) {
      push('Enter a valid price', 'error')
      return
    }
    if (!form.projectDomain) {
      push('Select a project domain', 'error')
      return
    }
    setCreating(true)
    try {
      const payload = {
        projectTitle: form.projectTitle.trim(),
        description: form.description.trim(),
        pricing: priceValue,
        projectDomain: form.projectDomain,
        keyWords: form.keyWords
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        subProjects: [],
      }

      const created = await adminApi.createProject(payload)
      push('Project created', 'success')
      setProjects((prev) => [created, ...prev])
      setSummary((prev) => (prev ? { ...prev, totalProjects: prev.totalProjects + 1 } : prev))
      setForm((prev) => ({
        ...prev,
        projectTitle: '',
        description: '',
        pricing: '',
        keyWords: '',
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create project'
      if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('token')) {
        handleAuthError(message)
      } else {
        push(message, 'error')
      }
    } finally {
      setCreating(false)
    }
  }

  const handleLogout = () => {
    clearAdminToken()
    navigate('/admin/login')
  }

  return (
    <div className="page-shell admin-shell">
      <NotificationStack notifications={notifications} onDismiss={dismiss} />
      <section className="panel admin-hero">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Control room for projects, domains, and assets</h1>
          <p className="muted">
            Build new domains, publish projects, and keep the catalog healthy. All changes sync instantly.
          </p>
          <div className="action-row">
            <button type="button" className="ghost" onClick={() => navigate('/')}>
              View site
            </button>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
            <button type="button" className="ghost" onClick={load} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh data'}
            </button>
          </div>
        </div>
        <div className="mini-stats">
          <div className="stat-chip">
            <span className="chip-label">Projects</span>
            <strong>{summary?.totalProjects ?? '–'}</strong>
          </div>
          <div className="stat-chip">
            <span className="chip-label">Domains</span>
            <strong>{summary?.totalDomains ?? '–'}</strong>
          </div>
          <div className="stat-chip">
            <span className="chip-label">Assets</span>
            <strong>{summary?.totalContents ?? '–'}</strong>
          </div>
          <div className="stat-chip">
            <span className="chip-label">Keywords</span>
            <strong>{totalKeywords}</strong>
          </div>
        </div>
      </section>

      <section className="panel-grid wide">
        <article className="panel stats" aria-busy={loading}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">Snapshot</p>
              <h3>Catalog status</h3>
            </div>
          </div>
          <div className="stat-grid big">
            <div className="stat-card">
              <p className="label">Projects</p>
              <p className="value">{summary?.totalProjects ?? '–'}</p>
              <p className="helper">Live in catalog</p>
            </div>
            <div className="stat-card">
              <p className="label">Domains</p>
              <p className="value">{summary?.totalDomains ?? '–'}</p>
              <p className="helper">Organized categories</p>
            </div>
            <div className="stat-card">
              <p className="label">Assets</p>
              <p className="value">{summary?.totalContents ?? '–'}</p>
              <p className="helper">Downloadable files</p>
            </div>
            <div className="stat-card">
              <p className="label">Keywords</p>
              <p className="value">{totalKeywords}</p>
              <p className="helper">Search tags across projects</p>
            </div>
          </div>
        </article>

        <article className="panel">
          <p className="eyebrow">Create domain</p>
          <h3>Keep catalog organized</h3>
          <form className="form-grid" onSubmit={handleCreateDomain}>
            <label>
              Name
              <input
                type="text"
                required
                value={domainForm.name}
                onChange={(event) => setDomainForm({ ...domainForm, name: event.target.value })}
                placeholder="Machine Learning"
              />
            </label>
            <label>
              Description
              <textarea
                value={domainForm.description}
                onChange={(event) => setDomainForm({ ...domainForm, description: event.target.value })}
                placeholder="Optional summary for this domain"
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={creatingDomain}>
                {creatingDomain ? 'Saving…' : 'Add domain'}
              </button>
              <span className="muted small">Projects must be assigned to a domain to be listed.</span>
            </div>
          </form>
          {domains.length === 0 && <p className="muted small">No domains yet. Add one to unlock project creation.</p>}
          {domains.length > 0 && (
            <div className="pill-row">
              {domains.slice(0, 6).map((domain) => (
                <span key={domain._id} className="pill">
                  {domain.name}
                </span>
              ))}
              {domains.length > 6 && <span className="pill muted">+{domains.length - 6} more</span>}
            </div>
          )}
        </article>
      </section>

      <section className="panel-grid wide">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Publish</p>
              <h3>New project</h3>
            </div>
            <span className="helper">{domains.length === 0 ? 'Add a domain first' : 'Ready to publish'}</span>
          </div>
          <form className="form-grid split-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <p className="section-title">Basics</p>
              <label>
                Title
                <input
                  type="text"
                  required
                  value={form.projectTitle}
                  onChange={(event) => setForm({ ...form, projectTitle: event.target.value })}
                  placeholder="AI Resume Builder"
                  disabled={domains.length === 0}
                />
              </label>
              <label>
                Description
                <textarea
                  required
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Short summary of what this project teaches and ships."
                  disabled={domains.length === 0}
                />
              </label>
            </div>

            <div className="form-section">
              <p className="section-title">Classification</p>
              <div className="input-row">
                <label>
                  Pricing
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.pricing}
                    onChange={(event) => setForm({ ...form, pricing: event.target.value })}
                    disabled={domains.length === 0}
                  />
                </label>
                <label>
                  Domain
                  <select
                    required
                    value={form.projectDomain}
                    onChange={(event) => setForm({ ...form, projectDomain: event.target.value })}
                    disabled={domains.length === 0}
                  >
                    <option value="" disabled>
                      Select domain
                    </option>
                    {domains.map((domain) => (
                      <option key={domain._id} value={domain._id}>
                        {domain.name}
                      </option>
                    ))}
                  </select>
                  <span className="helper">Selected: {selectedDomainName || 'None'}</span>
                </label>
              </div>
              <label>
                Keywords
                <input
                  type="text"
                  value={form.keyWords}
                  onChange={(event) => setForm({ ...form, keyWords: event.target.value })}
                  placeholder="comma,separated,keywords"
                  disabled={domains.length === 0}
                />
                <span className="helper">Comma separated; improves searchability.</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={creating || loading || domains.length === 0}>
                {creating ? 'Saving…' : 'Create project'}
              </button>
              <span className="muted small">
                Sub-projects and assets can be added later via API or an extended form.
              </span>
            </div>
          </form>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Inventory</p>
              <h3>Recent projects</h3>
            </div>
            <button type="button" className="ghost" onClick={load} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          {projects.length === 0 && !loading && <p className="muted">No projects yet. Add one above.</p>}
          {projects.length > 0 && (
            <div className="data-table">
              <div className="table-head">
                <span>Title</span>
                <span>Domain</span>
                <span>Price</span>
                <span>Updated</span>
              </div>
              {projects.slice(0, 8).map((project) => (
                <div key={project._id} className="table-row">
                  <span>{project.projectTitle}</span>
                  <span>{domains.find((d) => d._id === project.projectDomain)?.name || '—'}</span>
                  <span>${project.pricing}</span>
                  <span>{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="panel-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Activity</p>
              <h3>Latest published</h3>
            </div>
          </div>
          {summary?.recentProjects?.length ? (
            <ul className="activity-list">
              {summary.recentProjects.map((project) => (
                <li key={project._id}>
                  <div>
                    <p className="activity-title">{project.projectTitle}</p>
                    <p className="muted small">
                      {domains.find((d) => d._id === project.projectDomain)?.name || 'Unassigned'} · $
                      {project.pricing}
                    </p>
                  </div>
                  <span className="tag">
                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'New'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No recent activity.</p>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Domains</p>
              <h3>Full list</h3>
            </div>
          </div>
          {domains.length === 0 && <p className="muted">No domains created yet.</p>}
          {domains.length > 0 && (
            <div className="data-table compact">
              <div className="table-head">
                <span>Name</span>
                <span>Description</span>
              </div>
              {domains.map((domain) => (
                <div key={domain._id} className="table-row">
                  <span>{domain.name}</span>
                  <span className="muted small">{domain.description || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  )
}
