const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/services', (req, res) => res.json([
  { id: 1, name: 'Haircut', duration: 30, price: 25 },
  { id: 2, name: 'Shave', duration: 20, price: 15 },
  { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
  { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
]));
app.get('/api/available-times', (req, res) => res.json(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']));
app.post('/api/appointments', (req, res) => res.json({ id: Math.random(), status: 'success' }));
app.get('/api/appointments', (req, res) => res.json([]));

app.listen(PORT, '0.0.0.0', () => console.log('Backend running on ' + PORT));

