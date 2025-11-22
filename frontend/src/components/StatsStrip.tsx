const stats = [
  { label: 'Curated bundles', value: '120+' },
  { label: 'Learners shipped', value: '4.8k' },
  { label: 'Avg. completion time', value: '21 days' },
  { label: 'Mentor office hours', value: '2/week' },
]

export const StatsStrip = () => (
  <div className="stats-strip">
    {stats.map((stat) => (
      <div key={stat.label}>
        <p className="value">{stat.value}</p>
        <p className="label">{stat.label}</p>
      </div>
    ))}
  </div>
)
