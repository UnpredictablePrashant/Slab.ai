import { highlights } from '../data/highlights'

export const Highlights = () => (
  <div className="highlight-grid">
    {highlights.map((highlight) => (
      <article key={highlight.title}>
        <div className="icon">{highlight.icon}</div>
        <h4>{highlight.title}</h4>
        <p>{highlight.description}</p>
      </article>
    ))}
  </div>
)
