import { useMemo, useState } from 'react'
import { formatCurrency, formatHours } from '../lib/formatters'
import type { Project } from '../types/project'

interface Props {
  project: Project
  domainLabel?: string
  onSelect: (project: Project) => void
}

const placeholderPalette = ['#fce7f3', '#dbeafe', '#dcfce7', '#fee2e2']

const getPlaceholderColor = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return placeholderPalette[hash % placeholderPalette.length]
}

export const ProjectCard = ({ project, onSelect, domainLabel }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const subProjects = project.subProjects ?? []
  const previewSubProjects = expanded ? subProjects : subProjects.slice(0, 2)

  const keywords = useMemo(
    () => (project.keyWords && project.keyWords.length ? project.keyWords : ['No tags added yet']),
    [project.keyWords],
  )

  return (
    <article className="project-card">
      <div className="project-media">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.projectTitle} loading="lazy" />
        ) : (
          <div className="project-placeholder" style={{ backgroundColor: getPlaceholderColor(project._id) }}>
            <span>{project.projectTitle.slice(0, 1)}</span>
          </div>
        )}
        <div className="project-media-tag">{domainLabel ?? 'Multi domain'}</div>
      </div>

      <div className="project-body">
        <header>
          <p className="eyebrow">{project.noOfSubProjects ?? subProjects.length} sub-projects</p>
          <h3>{project.projectTitle}</h3>
          <p className="project-description">{project.description}</p>
        </header>

        <ul className="keyword-list">
          {keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>

        <div className="project-actions">
          <div>
            <p className="label">Investment</p>
            <p className="price">{formatCurrency(project.pricing)}</p>
          </div>
          <button type="button" onClick={() => onSelect(project)}>
            Purchase bundle
          </button>
        </div>

        {subProjects.length > 0 && (
          <div className="subproject-list">
            <div className="label">Inside the bundle</div>
            {previewSubProjects.map((sub) => (
              <div key={sub.projectName} className="subproject">
                <div>
                  <p className="subproject-title">{sub.projectName}</p>
                  <p className="subproject-description">{sub.projectDescription}</p>
                </div>
                <div className="subproject-meta">
                  <span>{sub.toolsUsed?.join(', ') || 'Tools TBD'}</span>
                  <span>{formatHours(sub.timeToWorkOnProject)}</span>
                </div>
              </div>
            ))}
            {subProjects.length > previewSubProjects.length && (
              <button className="link" type="button" onClick={() => setExpanded(true)}>
                Show {subProjects.length - previewSubProjects.length} more
              </button>
            )}
            {expanded && subProjects.length > 2 && (
              <button className="link" type="button" onClick={() => setExpanded(false)}>
                Collapse list
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
