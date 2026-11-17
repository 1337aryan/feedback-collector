import { useState } from 'react'
import { Plus } from 'lucide-react'
import FeedbackForm from './FeedbackForm'
import { formatDate } from '../utils/dateUtils'

const PAGE_TITLES = {
  dashboard: 'Feedback Dashboard',
  feedback: 'All Feedback',
}

const PAGE_DESCS = {
  dashboard: 'Overview of all submitted feedback and key metrics',
  feedback: 'Browse, search and manage all feedback entries',
}

export default function Navbar({ activePage }) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleSuccess = () => {
    setModalOpen(false)
    // Dispatch custom event so Dashboard can refresh
    window.dispatchEvent(new CustomEvent('feedbackCreated'))
  }

  const today = formatDate(new Date().toISOString())

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-title">{PAGE_TITLES[activePage] || 'Dashboard'}</h1>
          <p className="navbar-desc">{PAGE_DESCS[activePage] || ''}</p>
        </div>
        <div className="navbar-right">
          <span className="navbar-date">{today}</span>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Add Feedback
          </button>
        </div>
      </header>

      {/* Add Feedback Modal */}
      {modalOpen && (
        <div className="form-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div className="form-modal-card">
            <FeedbackForm onSuccess={handleSuccess} onCancel={() => setModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
