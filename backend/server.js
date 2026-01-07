const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('Server starting...');

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.get('/health', (req, res) => {
  console.log('GET /health');
  res.json({ 
    status: 'ok', 
    message: 'Server is working!',
    port: PORT 
  });
});

app.get('/ping', (req, res) => {
  console.log('GET /ping');
  res.send('pong');
});

app.get('/api/services', (req, res) => {
  console.log('GET /api/services');
  const services = [
    { id: 1, name: 'Haircut', duration: 30, price: 25 },
    { id: 2, name: 'Shave', duration: 20, price: 15 },
    { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
    { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
  ];
  res.json(services);
});

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Server listening on port ' + PORT);
});

// Catch errors
process.on('uncaughtException', (err) => {
  console.error('Error:', err);
});

