import React, { useState } from 'react'
import { Button, Card, TextInput, Label, Alert } from 'flowbite-react'
import { login, register } from '../api'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isRegister, setIsRegister] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    try {
      const fn = isRegister ? register : login
      const token = await fn(email, password)
      if (typeof token === 'string') {
        onLogin(token)
      } else if (token?.token) {
        onLogin(token.token)
      } else {
        throw new Error('Invalid token response')
      }
    } catch (err) {
      setError(err?.message || String(err))
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-md px-4">
        <Card>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            {isRegister ? 'Register' : 'Login'}
          </h2>
          {error && (
            <Alert color="failure" className="mb-4">
              <span>{error}</span>
            </Alert>
          )}
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button color="blue" outline type="button" type="submit">
                {isRegister ? 'Register' : 'Login'}
              </Button>
              <Button color="gray" outline type="button" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Have an account? Login' : 'No account? Register'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
