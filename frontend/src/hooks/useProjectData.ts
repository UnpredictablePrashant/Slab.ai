import { useCallback, useEffect, useState } from 'react'
import { projectApi } from '../lib/api'
import type { Project, ProjectDomain } from '../types/project'

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [domains, setDomains] = useState<ProjectDomain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [projectData, domainData] = await Promise.all([projectApi.list(), projectApi.domains()])
      setProjects(projectData)
      setDomains(domainData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    projects,
    domains,
    loading,
    error,
    refetch: load,
  }
}
