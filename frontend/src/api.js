const API_BASE = import.meta.env.VITE_API_BASE || 'https://localhost:7240'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || API_BASE === 'mock'

// In-memory mock state (persists for the session)
const mockData = {
  users: [ { id: 1, email: 'aa@aa.aa' } ],
  tasks: [
    { id: 1, title: 'This is my task 1', completed: false, createdAt: new Date(), userId: 1, priority: 'medium', dueDate: addDaysToDate(new Date(), 1) },
    { id: 2, title: 'This is my task 2', completed: true, createdAt: new Date(), userId: 1, priority: 'high', dueDate: addDaysToDate(new Date(), 2) },
    { id: 3, title: 'This is my task 3', completed: true, createdAt: new Date(), userId: 1, priority: 'low', dueDate: addDaysToDate(new Date(), 3) },
  ],
  nextTaskId: 4,  
}

function addDaysToDate(date, days) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

async function request(path, options = {}) {
  if (USE_MOCK) {
    // small simulated latency
    await new Promise((r) => setTimeout(r, 100))

    // Auth: login
    if (path === '/api/auth/login' && (options.method || 'POST').toUpperCase() === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {}
      const email = body.email || 'aa@aa.aa'
      let user = mockData.users.find((u) => u.email === email)
      if (!user) {
        user = { id: mockData.users.length + 1, email }
        mockData.users.push(user)
      }
      return { token: 'mock-token', user }
    }

    // Auth: register
    if (path === '/api/auth/register' && (options.method || 'POST').toUpperCase() === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {}
      const email = body.email || `user${mockData.users.length + 1}@local`
      const user = { id: mockData.users.length + 1, email }
      mockData.users.push(user)
      return { token: 'mock-token', user }
    }

    // Get tasks
    if (path === '/tasks' && !(options.method && options.method.toUpperCase() !== 'GET')) {
      // return all tasks (ignore token for mock)
      return mockData.tasks.slice()
    }

    // Create task
    if (path === '/tasks' && (options.method || '').toUpperCase() === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {}
      const title = body.title || 'Untitled'
      const today = new Date()
      const task = {
        id: mockData.nextTaskId++,
        title,
        completed: false,
        createdAt: new Date(),
        userId: 1,
        priority: 'low',
        dueDate: addDaysToDate(new Date(), 7),
      }
      mockData.tasks.push(task)
      return task
    }

    // default mock fallback
    return null
  }

  const url = `${API_BASE}${path}`
  const res = await fetch(url, options)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json().catch(() => null)
}

export function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export function register(email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export function getTasks(token) {
  return request('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function createTask(token, title) {
  return request('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title }),
  })
}
