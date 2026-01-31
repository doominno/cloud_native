import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  const getTodos = async () => {
    try {
      const res = await axios.get('http://mern-backend.production.svc.cluster.local:5000/api/todos');
      setTodos(res.data);
      } catch (err) {
        console.error("Error al cargar todos:", err);
      }
     };

  const handleAddOrUpdate = async () => {
    if (!task.trim()) return;
    if (editId) {
      await axios.put(`http://localhost:5000/api/todos/${editId}`, { task });
      setEditId(null);
    } else {
      await axios.post('http://localhost:5000/api/todos', { task });
    }
    setTask('');
    getTodos();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    getTodos();
  };

  const handleEdit = (todo) => {
    setTask(todo.task);
    setEditId(todo._id);
  };

  return (
    <div className="app-container">
      <h1>Todo List</h1>

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
