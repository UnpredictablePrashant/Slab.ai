import type { Project } from '../types/project'
import { ProjectCard } from './ProjectCard'

interface Props {
  projects: Project[]
  loading: boolean
  domainMap: Record<string, string>
  onSelectProject: (project: Project) => void
}

export const ProjectGrid = ({ projects, loading, domainMap, onSelectProject }: Props) => {
  if (loading) {
    return (
      <div className="project-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="project-card skeleton" aria-hidden="true" />
        ))}
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="empty-state">
        <p>No projects match the current filters.</p>
        <p>Try resetting the filters or search with a different keyword.</p>
      </div>
    )
  }

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          domainLabel={domainMap[project.projectDomain ?? '']}
          onSelect={onSelectProject}
        />
      ))}
    </div>
  )
}
