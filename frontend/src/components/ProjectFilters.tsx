import type { ProjectDomain } from '../types/project'

interface Props {
  domains: ProjectDomain[]
  selectedDomain: string
  onSelectDomain: (value: string) => void
  query: string
  onQueryChange: (value: string) => void
}

const defaultFilters = [
  { id: 'all', label: 'All domains' },
  { id: 'featured', label: 'Featured' },
]

export const ProjectFilters = ({ domains, selectedDomain, onSelectDomain, query, onQueryChange }: Props) => {
  return (
    <div className="filter-panel">
      <div className="filters">
        {[...defaultFilters, ...domains.map((domain) => ({ id: domain._id, label: domain.name }))].map((filter) => (
          <button
            key={filter.id}
            className={`filter-chip ${selectedDomain === filter.id ? 'active' : ''}`}
            onClick={() => onSelectDomain(filter.id)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>
      <label className="search-field">
        <span>Search keywords</span>
        <input
          type="search"
          placeholder='Try "UI automation" or "Python"'
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>
    </div>
  )
}
