import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await api.get('/Tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const response = await api.post('/Tasks', newTask);
      setTasks([response.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, isCompleted: !task.isCompleted };
      const response = await api.put(`/Tasks/${task.id}`, updatedTask);
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/Tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Мои задачи
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Название задачи"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Описание"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <Button
            variant="contained"
            onClick={handleCreateTask}
            sx={{ mt: 2 }}
            fullWidth
          >
            Добавить задачу
          </Button>
        </Box>

        <List>
          {tasks.map((task) => (
            <ListItem key={task.id} dense>
              <Checkbox
                checked={task.isCompleted}
                onChange={() => handleToggleComplete(task)}
              />
              <ListItemText
                primary={
                  <Typography style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                    {task.title}
                  </Typography>
                }
                secondary={task.description}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default TaskList;