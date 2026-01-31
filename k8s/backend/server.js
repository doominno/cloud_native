import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*'  // Para pruebas. Luego puedes poner la URL de tu frontend
}));
app.use(express.json());

app.use('/api/todos', todoRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error ❌', err));
