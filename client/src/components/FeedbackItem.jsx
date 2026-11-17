import { Trash2 } from 'lucide-react'
import { formatRelativeTime } from '../utils/dateUtils'

/**
 * Returns the first letter(s) of a name as initials for the avatar.
 */
function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function FeedbackItem({ feedback, onDelete }) {
  const { _id, name, email, message, createdAt } = feedback

  return (
    <div className="feedback-item">
      {/* Avatar */}
      <div className="feedback-avatar" aria-hidden="true">
        {getInitials(name)}
      </div>

      {/* Content */}
      <div className="feedback-content">
        <div className="feedback-header">
          <span className="feedback-name">{name}</span>
          <span className="feedback-date">{formatRelativeTime(createdAt)}</span>
        </div>
        <div className="feedback-email">{email}</div>
        <p className="feedback-message">{message}</p>
      </div>

      {/* Delete button */}
      <button
        className="btn-delete"
        onClick={() => onDelete(_id)}
        aria-label={`Delete feedback from ${name}`}
        title="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
