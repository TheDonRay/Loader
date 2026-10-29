import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/product.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  const dbUp = mongoose.connection.readyState === 1; 
  // the ? operator is similar to a if statement 
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? 'ok' : 'degraded',
    db: dbUp ? 'connected' : 'disconnected',
  });
});

app.use('/products', productRoutes);

export default app;
