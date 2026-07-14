# Task Manager Dashboard

This frontend is a lightweight React + Vite client for the task manager backend.

## Tech stack
- React 18
- Vite for development and build tooling
- Material UI (MUI) for component styling
- JavaScript/JSX for component-based UI
- Fetch API for REST communication with the backend

## What the frontend does
- Shows a login/register experience for users
- Displays the authenticated user's task list
- Lets users add new tasks through the dashboard
- Stores the JWT returned by the API and sends it with future requests

## How it communicates with the backend
- The app uses a small API helper in src/api.js to centralize requests.
- By default, it expects the backend at http://localhost:5253.
- You can override the base URL with VITE_API_BASE when starting the dev server.
- It calls:
  - POST /api/auth/login
  - POST /api/auth/register
  - GET /tasks
  - POST /tasks

## Quick start
Install dependencies:
```bash
cd frontend
npm install
```

Start the dev server:
```bash
npm run dev
```

