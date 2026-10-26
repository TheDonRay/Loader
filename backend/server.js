import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/dbconnection.config.js';

const PORT = process.env.PORT || 3000;

try {
  await connectDB();
} catch (err) {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
