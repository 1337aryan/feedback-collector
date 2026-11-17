/**
 * StatsCard component
 * Displays a single statistic with an icon, value, and title.
 */
export default function StatsCard({ title, value, icon: Icon, color }) {
  const isLoading = value === undefined || value === null

  return (
    <div className="stats-card">
      {/* Icon area */}
      <div
        className="stats-card-icon"
        style={{ background: color ? `${color}18` : '#eff6ff' }}
      >
        {Icon && (
          <Icon size={22} style={{ color: color || 'var(--color-primary)' }} />
        )}
      </div>

      {/* Text area */}
      <div>
        {isLoading ? (
          <>
            <div className="skeleton" style={{ width: 60, height: 28, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: 100, height: 14 }} />
          </>
        ) : (
          <>
            <div className="stats-card-value">{value}</div>
            <div className="stats-card-title">{title}</div>
          </>
        )}
      </div>
    </div>
  )
}
