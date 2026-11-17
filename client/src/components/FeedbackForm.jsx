import { useState } from 'react'
import { X } from 'lucide-react'
import { createFeedback } from '../services/feedbackService'
import { validateFeedbackForm, hasValidationErrors } from '../utils/validators'

const INITIAL_FORM = { name: '', email: '', message: '' }
const INITIAL_ERRORS = { name: null, email: null, message: null }

export default function FeedbackForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState(null) // { type: 'success'|'error', message: string }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert(null)

    const validationErrors = validateFeedbackForm(formData)
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await createFeedback({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      })
      setAlert({ type: 'success', message: 'Feedback submitted successfully!' })
      setFormData(INITIAL_FORM)
      setErrors(INITIAL_ERRORS)
      // Notify parent after a short delay so user sees success message
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 1000)
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to submit feedback. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Modal header */}
      <div className="form-modal-header">
        <h2 className="form-modal-title">Submit Feedback</h2>
        {onCancel && (
          <button className="btn-icon" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="fb-name">Full Name</label>
          <input
            id="fb-name"
            type="text"
            name="name"
            className={`form-input${errors.name ? ' error' : ''}`}
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="name"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="fb-email">Email Address</label>
          <input
            id="fb-email"
            type="email"
            name="email"
            className={`form-input${errors.email ? ' error' : ''}`}
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="email"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* Message */}
        <div className="form-group">
          <label className="form-label" htmlFor="fb-message">Message</label>
          <textarea
            id="fb-message"
            name="message"
            className={`form-textarea${errors.message ? ' error' : ''}`}
            placeholder="Share your feedback..."
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={5}
          />
          <div className="form-char-count">{formData.message.length} / 1000</div>
          {errors.message && <p className="form-error">{errors.message}</p>}
        </div>

        {/* Actions */}
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </div>
      </form>
    </>
  )
}
