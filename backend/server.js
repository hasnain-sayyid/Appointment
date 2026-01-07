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

app.get('/api/available-times', (req, res) => {
  console.log('GET /api/available-times');
  const times = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
  res.json(times);
});

app.post('/api/appointments', (req, res) => {
  console.log('POST /api/appointments');
  const { customerName, customerPhone, date, time, service, notes } = req.body;
  
  if (!customerName || !customerPhone || !date || !time || !service) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  res.json({
    id: Math.floor(Math.random() * 10000),
    customerName,
    customerPhone,
    date,
    time,
    service,
    notes,
    createdAt: new Date()
  });
});

app.get('/api/appointments', (req, res) => {
  console.log('GET /api/appointments');
  res.json([]);
});

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Server listening on port ' + PORT);
});

// Catch errors
process.on('uncaughtException', (err) => {
  console.error('Error:', err);
});

