import { MessageSquare } from 'lucide-react'
import FeedbackItem from './FeedbackItem'

/**
 * Skeleton placeholder for a loading feedback item
 */
function SkeletonItem() {
  return (
    <div className="skeleton-card feedback-item">
      <div className="skeleton" style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: '40%', height: 15, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: '25%', height: 13, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: '100%', height: 13, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: '80%', height: 13 }} />
      </div>
    </div>
  )
}

export default function FeedbackList({ feedbackList, isLoading, onDelete, searchTerm, dateFilter }) {
  if (isLoading) {
    return (
      <div className="feedback-list">
        {[1, 2, 3].map((n) => (
          <SkeletonItem key={n} />
        ))}
      </div>
    )
  }

  if (feedbackList.length === 0) {
    const hasFilters = searchTerm || dateFilter
    return (
      <div className="empty-state">
        <MessageSquare size={48} className="empty-state-icon" />
        <h3 className="empty-state-title">
          {hasFilters ? 'No results found' : 'No feedback yet'}
        </h3>
        <p className="empty-state-desc">
          {hasFilters
            ? "Try adjusting your search or date filter to find what you're looking for."
            : 'Be the first to submit feedback using the "Add Feedback" button above.'}
        </p>
      </div>
    )
  }

  return (
    <div className="feedback-list">
      {feedbackList.map((item) => (
        <FeedbackItem key={item._id} feedback={item} onDelete={onDelete} />
      ))}
    </div>
  )
}
