const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', port: PORT });
});

// Ping
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Services
app.get('/api/services', (req, res) => {
  res.json([
    { id: 1, name: 'Haircut', duration: 30, price: 25 },
    { id: 2, name: 'Shave', duration: 20, price: 15 },
    { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
    { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

