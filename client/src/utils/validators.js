/**
 * Client-side form validation utilities
 */

export const validateName = (name) => {
  if (!name || !name.trim()) return 'Full name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  if (name.trim().length > 50) return 'Name cannot exceed 50 characters'
  return null
}

export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email address is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address'
  return null
}

export const validateMessage = (message) => {
  if (!message || !message.trim()) return 'Message is required'
  if (message.trim().length < 10) return 'Message must be at least 10 characters'
  if (message.trim().length > 1000) return 'Message cannot exceed 1000 characters'
  return null
}

export const validateFeedbackForm = (formData) => {
  return {
    name: validateName(formData.name),
    email: validateEmail(formData.email),
    message: validateMessage(formData.message),
  }
}

export const hasValidationErrors = (errors) => {
  return Object.values(errors).some((error) => error !== null)
}
