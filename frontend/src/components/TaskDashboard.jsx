import React, { useEffect, useState } from 'react'
import { Button, Card, TextInput, Label, Spinner, Alert } from 'flowbite-react'
import { getTasks, createTask } from '../api'

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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Your Tasks</h2>
            <p className="mt-1 text-sm text-slate-500">A quick place to manage your task list.</p>
          </div>
          <Button color="light" outline onClick={onLogout}>
            Logout
          </Button>
        </div>

        <Card>
          <form onSubmit={addTask} className="mb-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="taskTitle" value="Task title" />
              </div>
              <TextInput
                id="taskTitle"
                placeholder="Add a new task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={submitting || !title.trim()}>
              {submitting ? 'Adding...' : 'Add Task'}
            </Button>
          </form>

          {loading && (
            <div className="mb-4 flex items-center gap-2 text-slate-600">
              <Spinner size="sm" />
              Loading tasks...
            </div>
          )}

          {error && (
            <Alert color="failure" className="mb-4">
              <span>{error}</span>
            </Alert>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              You have no tasks yet. Add your first one to get started.
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div className="grid gap-3">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-slate-50">
                  <p className="text-base text-slate-800">{task.title}</p>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
