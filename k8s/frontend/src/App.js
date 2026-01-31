import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://mern-backend:5000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  const getTodos = async () => {
    setError(null);
    try {
      const res = await api.get('/api/todos');
      setTodos(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Error al conectar con el servidor';
      setError(msg);
      console.error('Error al cargar todos:', err);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!task.trim()) return;
    setError(null);
    try {
      if (editId) {
        await api.put(`/api/todos/${editId}`, { task });
        setEditId(null);
      } else {
        await api.post('/api/todos', { task });
      }
      setTask('');
      await getTodos();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Error al guardar';
      setError(msg);
      console.error('Error al guardar:', err);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await api.delete(`/api/todos/${id}`);
      await getTodos();
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Error al eliminar';
      setError(msg);
      console.error('Error al eliminar:', err);
    }
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setEditId(todo._id);
  };

  return (
    <div className="app-container">
      <h1>Todo List</h1>
      {error && <p className="error-msg">{error}</p>}

      <div className="input-group">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editId ? 'Update' : 'Add'}
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id}>
            <span>{todo.task}</span>
            <div className="btn-group">
              <button className="edit" onClick={() => handleEdit(todo)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(todo._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
