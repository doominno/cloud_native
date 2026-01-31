import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI no está definida en .env');
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: '*'  // Para pruebas. Luego puedes poner la URL de tu frontend
}));
app.use(express.json());

app.use('/api/todos', todoRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error ❌', err.message);
    process.exit(1);
  });
