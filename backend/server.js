const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('🔴 UNCAUGHT EXCEPTION:', error.message);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

// Initialize database
console.log('📦 Initializing database...');
db.init();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ping route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Get appointments by date
app.get('/api/appointments', (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  db.getAppointmentsByDate(date, (err, appointments) => {
    if (err) {
      console.error('Database error in getAppointmentsByDate:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(appointments);
  });
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  db.getAppointmentById(req.params.id, (err, appointment) => {
    if (err) {
      console.error('Database error in getAppointmentById:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  });
});

// Create appointment
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
        console.error('Database error in createAppointment:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: appointmentId,
        message: 'Appointment created successfully'
      });
    }
  );
});

// Update appointment
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
        console.error('Database error in updateAppointment:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Appointment updated successfully' });
    }
  );
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  db.deleteAppointment(req.params.id, (err) => {
    if (err) {
      console.error('Database error in deleteAppointment:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Appointment deleted successfully' });
  });
});

// Get available times
app.get('/api/available-times', (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  db.getAvailableTimes(date, (err, times) => {
    if (err) {
      console.error('Database error in getAvailableTimes:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(times);
  });
});

// Get services
app.get('/api/services', (req, res) => {
  try {
    const services = db.getServices();
    res.json(services);
  } catch (error) {
    console.error('Error in /api/services:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
