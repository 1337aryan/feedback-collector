import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, X, BarChart3, Calendar, TrendingUp } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import FeedbackList from '../components/FeedbackList'
import ModalComponent from '../components/ModalComponent'
import { getAllFeedback, getFeedbackStats, deleteFeedback } from '../services/feedbackService'
import { isSameDay } from '../utils/dateUtils'

export default function Dashboard() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [feedbackList, setFeedbackList] = useState([])
  const [stats, setStats] = useState({ total: null, today: null, thisWeek: null })
  const [isLoading, setIsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, feedbackId: null, feedbackName: '' })
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })

  // ── Data Fetching ──────────────────────────────────────────────────────────
  const loadFeedback = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllFeedback()
      // getAllFeedback() now returns the array directly
      setFeedbackList(Array.isArray(data) ? data : [])
    } catch (err) {
      showNotification('error', err.message || 'Failed to load feedback')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    setIsStatsLoading(true)
    try {
      const data = await getFeedbackStats()
      setStats({
        total: data.total ?? 0,
        today: data.today ?? 0,
        thisWeek: data.thisWeek ?? 0,
      })
    } catch (err) {
      // Stats failing is non-critical; compute from feedbackList as fallback
      console.warn('Stats endpoint unavailable:', err.message)
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  // ── Mount Effect ───────────────────────────────────────────────────────────
  useEffect(() => {
    loadFeedback()
    loadStats()
  }, [loadFeedback, loadStats])

  // ── Listen for 'feedbackCreated' custom event ──────────────────────────────
  useEffect(() => {
    const handleFeedbackCreated = () => {
      loadFeedback()
      loadStats()
      showNotification('success', 'Feedback submitted successfully!')
    }
    window.addEventListener('feedbackCreated', handleFeedbackCreated)
    return () => window.removeEventListener('feedbackCreated', handleFeedbackCreated)
  }, [loadFeedback, loadStats])

  // ── Filtering (computed) ───────────────────────────────────────────────────
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((item) => {
      const term = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !term ||
        item.name?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.message?.toLowerCase().includes(term)

      const matchesDate =
        !dateFilter ||
        isSameDay(item.createdAt, `${dateFilter}T00:00:00`)

      return matchesSearch && matchesDate
    })
  }, [feedbackList, searchTerm, dateFilter])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDeleteClick = (id, name) => {
    setDeleteModal({ isOpen: true, feedbackId: id, feedbackName: name })
  }

  const handleDeleteConfirm = async () => {
    const { feedbackId } = deleteModal
    setDeleteModal({ isOpen: false, feedbackId: null, feedbackName: '' })
    try {
      await deleteFeedback(feedbackId)
      setFeedbackList((prev) => prev.filter((item) => item._id !== feedbackId))
      setStats((prev) => ({ ...prev, total: Math.max(0, (prev.total ?? 1) - 1) }))
      showNotification('success', 'Feedback deleted successfully.')
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete feedback.')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, feedbackId: null, feedbackName: '' })
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setDateFilter('')
  }

  const hasFilters = searchTerm || dateFilter

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Stats Section */}
      <div className="stats-grid">
        <StatsCard
          title="Total Feedback"
          value={isStatsLoading ? null : stats.total}
          icon={BarChart3}
          color="#2563eb"
        />
        <StatsCard
          title="Received Today"
          value={isStatsLoading ? null : stats.today}
          icon={Calendar}
          color="#16a34a"
        />
        <StatsCard
          title="This Week"
          value={isStatsLoading ? null : stats.thisWeek}
          icon={TrendingUp}
          color="#d97706"
        />
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-row">
          {/* Search */}
          <div className="filter-search-wrap">
            <Search size={16} className="filter-search-icon" />
            <input
              type="text"
              className="filter-search"
              placeholder="Search by name, email or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date filter */}
          <input
            type="date"
            className="filter-date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            title="Filter by date"
          />

          {/* Clear filters */}
          {hasFilters && (
            <button className="btn-clear" onClick={handleClearFilters}>
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="results-count">
          {hasFilters
            ? `Showing ${filteredFeedback.length} of ${feedbackList.length} feedback`
            : `${feedbackList.length} total feedback`}
        </p>
      </div>

      {/* Feedback List */}
      <FeedbackList
        feedbackList={filteredFeedback}
        isLoading={isLoading}
        onDelete={(id) => {
          const item = feedbackList.find((f) => f._id === id)
          handleDeleteClick(id, item?.name || 'Unknown')
        }}
        searchTerm={searchTerm}
        dateFilter={dateFilter}
      />

      {/* Delete Confirm Modal */}
      <ModalComponent
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        feedbackName={deleteModal.feedbackName}
      />
    </>
  )
}
