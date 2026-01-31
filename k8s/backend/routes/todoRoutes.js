import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error('Error al listar todos:', err);
    res.status(503).json({ error: 'Servicio no disponible. Revisa la conexión a la base de datos.' });
  }
});

// POST new todo
router.post('/', async (req, res) => {
  const { task } = req.body;
  try {
    const newTodo = await Todo.create({ task });
    console.log('Saved to DB:', newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: 'Task creation failed' });
  }
});

// PUT update todo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  try {
    const updated = await Todo.findByIdAndUpdate(id, { task }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
});

export default router;
