import React, { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LoginIcon from '@mui/icons-material/Login'

import { login, register } from '../api'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <Box className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <Paper
        elevation={5}
        sx={{
          width: '100%',
          maxWidth: 500,
          borderRadius: 4,
          px: { xs: 4, sm: 5 },
          py: { xs: 5, sm: 6 }
        }}
      >
        <Box mb={3}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {isRegister ? 'Create your account' : 'Welcome'}
          </Typography>
          <Typography color="text.secondary">
            {isRegister
              ? 'Register to start managing tasks and staying organized.'
              : 'Login to access your task dashboard and manage your workload.'}
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={submit}>
          <Stack spacing={3}>
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              fullWidth
            >
              {isRegister ? 'Register' : 'Login'}
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => setIsRegister((prev) => !prev)}
            >
              {isRegister ? 'Already have an account? Login' : 'New here? Register'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}
