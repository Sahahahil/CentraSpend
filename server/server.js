const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const { connectDatabase, isDbReady } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: isDbReady(),
    database: isDbReady() ? 'connected' : 'disconnected',
  });
});

app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/currencies', require('./routes/currencyRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

async function start() {
  try {
    await connectDatabase();
    require('./cron/recurringJob');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('Tips: run `sudo systemctl start mongod` or set USE_LOCAL_MONGO=true in server/.env');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();
