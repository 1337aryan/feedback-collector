/**
 * Feedback API service
 * Handles all communication with the backend REST API
 */
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error'
    return Promise.reject(new Error(message))
  }
)

/** Fetch all feedback records — returns array of feedback objects */
export const getAllFeedback = async () => {
  const response = await api.get('/feedback')
  // API returns { success, count, data: [...] }
  return response.data.data || []
}

/** Fetch a single feedback by ID — returns single feedback object */
export const getFeedbackById = async (id) => {
  const response = await api.get(`/feedback/${id}`)
  // API returns { success, data: {...} }
  return response.data.data
}

/** Create new feedback — returns created feedback object */
export const createFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData)
  // API returns { success, data: {...} }
  return response.data.data
}

/** Delete feedback by ID — returns { success, message } */
export const deleteFeedback = async (id) => {
  const response = await api.delete(`/feedback/${id}`)
  return response.data
}

/** Fetch dashboard statistics — returns { total, today, thisWeek } */
export const getFeedbackStats = async () => {
  const response = await api.get('/feedback/stats')
  // API returns { success, data: { total, today, thisWeek } }
  return response.data.data || { total: 0, today: 0, thisWeek: 0 }
}

export default api
