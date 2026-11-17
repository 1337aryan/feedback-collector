import { useEffect } from 'react'

/**
 * ModalComponent — Delete confirmation dialog
 * Props:
 *   isOpen: boolean
 *   onClose: () => void
 *   onConfirm: () => void
 *   feedbackName: string
 */
export default function ModalComponent({ isOpen, onClose, onConfirm, feedbackName }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <h2 className="modal-title" id="modal-title">Delete Feedback</h2>
        <p className="modal-desc">
          Are you sure you want to delete the feedback from{' '}
          <strong>{feedbackName}</strong>? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  )
}
