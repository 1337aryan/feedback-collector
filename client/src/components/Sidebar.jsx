import { MessageSquare, LayoutDashboard, List } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'feedback', label: 'All Feedback', icon: List },
]

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <MessageSquare size={22} className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">Feedback Collector</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar-nav-item${activePage === id ? ' active' : ''}`}
            onClick={() => setActivePage(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Version */}
      <div className="sidebar-version">v1.0.0</div>
    </aside>
  )
}
