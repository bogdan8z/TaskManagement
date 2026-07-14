import React, { useState } from 'react'
import Login from './components/Login'
import TaskDashboard2 from './components/TaskDashboard2'

export default function App() {
  const [token, setToken] = useState(null)

  return (
    <div className="app-container">
      {!token ? (
        <Login onLogin={setToken} />
      ) : (
        <TaskDashboard2 token={token} onLogout={() => setToken(null)} />
      )}
    </div>
  )
}
