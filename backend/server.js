const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('Server starting on port ' + PORT);

// Basic endpoints
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is working!' });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Services endpoint
app.get('/api/services', (req, res) => {
  const services = [
    { id: 1, name: 'Haircut', duration: 30, price: 25 },
    { id: 2, name: 'Shave', duration: 20, price: 15 },
    { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
    { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
  ];
  res.json(services);
});

// Available times endpoint
app.get('/api/available-times', (req, res) => {
  try {
    const times = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
    res.json(times);
  } catch (error) {
    console.error('Error in /api/available-times:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book appointment endpoint
app.post('/api/appointments', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in POST /api/appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
  res.json([]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Server is running on port ' + PORT);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

