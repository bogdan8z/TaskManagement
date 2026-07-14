import React, { useEffect, useState } from 'react'
import { FiMinusCircle, FiPocket  } from "react-icons/fi";

import { red, yellow, green } from '@mui/material/colors';
import {Alert, Card, IconButton, Button, Typography, Toolbar, Box, AppBar, Paper, Avatar, CircularProgress, TextField } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import { DataGrid } from '@mui/x-data-grid';

import ButtonAppBar from './TopMenuAppBar';

import { getTasks, createTask } from '../api'


 
const paginationModel = { page: 0, pageSize: 5 };
 
const dateFormatter = new Intl.DateTimeFormat("en-US");
const columns = [
{ field: 'id', headerName: 'ID', width: 70 },
{ field: 'title', headerName: 'Title', width: 330 },
{field: 'status',
    headerName: 'Status',
    width: 60,
    renderCell: (params) => (
      <div>
        {params.row.completed ? <TaskAltIcon color="success" fontSize="small" /> : <DoDisturbOnOutlinedIcon color="secondary" fontSize="small" />}
      </div>
    ),
},
{field: 'priority',
    headerName: 'Priority',
    width: 100,
    renderCell: (params) => (
      <div>
        {params.row.priority === 'high' ?  <label style={{ color: green[500] }}>HIGH</label>: 
        params.row.priority === 'medium' ?  <label style={{ color: yellow[500] }}>MEDIUM</label>:
        <label style={{ color: red[500] }}>LOW</label>}
      
      </div>
    ),
},
 {  
    field: "dueDate",
    headerName: "Due Date",
    width: 100,
    align: "center",
    type: "date",
    valueFormatter: (value) => dateFormatter.format(value),
  }
];

export default function TaskDashboard2({ token, onLogout }) {
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
      <ButtonAppBar></ButtonAppBar>
    <Card>
       <div className="mb-2 mt-3 block">
          <form onSubmit={addTask}>       
            <TextField id="outline-basic"  value={title} label="Add new task" variant="outlined" onChange={(e) => setTitle(e.target.value)} />
            <Button type="submit" style={{ display: 'none' }} disabled={submitting || !title.trim()}>
                {submitting ? 'Adding...' : 'Add Task'}
            </Button>
          </form>
       <div>
       </div>
       </div>
       {loading && (
            <div className="mb-4 flex items-center gap-2 text-slate-600">
              <CircularProgress aria-label="Loading tasks…" />
            </div>
          )}

          {error && (
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
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
              <Paper sx={{ height: 400, width: '100%' }}>
              <DataGrid
              rows={tasks}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0 }}
              />
              </Paper>
              </div>
          )}

    </Card>





    </div>
  )
}
