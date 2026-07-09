import React, { useEffect, useState } from 'react'
import { getTasks, createTask } from '../api'
import './TaskDashboard.css'

export default function TaskDashboard({ token, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getTasks(token)
      setTasks(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [token])

  async function addTask(e) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    setSubmitting(true)
    setError(null)

    try {
      await createTask(token, trimmedTitle)
      setTitle('')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="task-dashboard-card">
      <div className="task-dashboard-toolbar">
        <h2 className="task-dashboard-title">Your Tasks</h2>
        <button onClick={onLogout} className="task-dashboard-logoutButton">
          Logout
        </button>
      </div>

      <form onSubmit={addTask} className="task-dashboard-form">
        <input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="task-dashboard-input"
        />
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="task-dashboard-primaryButton"
        >
          {submitting ? 'Adding...' : 'Add'}
        </button>
      </form>

      {loading ? (
        <div className="task-dashboard-status">Loading...</div>
      ) : error ? (
        <div className="task-dashboard-error">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="task-dashboard-emptyState">No tasks yet. Add your first one.</div>
      ) : (
        <ul className="task-dashboard-list">
          {tasks.map((t) => (
            <li key={t.id} className="task-dashboard-listItem">
              {t.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}