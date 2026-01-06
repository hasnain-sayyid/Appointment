const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
db.init();

// Health check endpoint (for Render monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.get('/api/appointments', (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  db.getAppointmentsByDate(date, (err, appointments) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(appointments);
  });
});

app.get('/api/appointments/:id', (req, res) => {
  db.getAppointmentById(req.params.id, (err, appointment) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  });
});

app.post('/api/appointments', (req, res) => {
  const { customerName, customerPhone, date, time, service, notes } = req.body;

  if (!customerName || !customerPhone || !date || !time || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.createAppointment(
    customerName,
    customerPhone,
    date,
    time,
    service,
    notes,
    (err, appointmentId) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ 
        id: appointmentId, 
        message: 'Appointment created successfully' 
      });
    }
  );
});

app.put('/api/appointments/:id', (req, res) => {
  const { customerName, customerPhone, date, time, service, notes } = req.body;

  db.updateAppointment(
    req.params.id,
    customerName,
    customerPhone,
    date,
    time,
    service,
    notes,
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Appointment updated successfully' });
    }
  );
});

app.delete('/api/appointments/:id', (req, res) => {
  db.deleteAppointment(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Appointment deleted successfully' });
  });
});

app.get('/api/available-times', (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  db.getAvailableTimes(date, (err, times) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(times);
  });
});

app.get('/api/services', (req, res) => {
  const services = db.getServices();
  res.json(services);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
