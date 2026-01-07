const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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
  try {
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
  } catch (error) {
    console.error('Error in GET /api/appointments:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in GET /api/appointments/:id:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create appointment
app.post('/api/appointments', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in POST /api/appointments:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in PUT /api/appointments/:id:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  try {
    db.deleteAppointment(req.params.id, (err) => {
      if (err) {
        console.error('Database error in deleteAppointment:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Appointment deleted successfully' });
    });
  } catch (error) {
    console.error('Error in DELETE /api/appointments/:id:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available times
app.get('/api/available-times', (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in GET /api/available-times:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('');
  console.log('✅ SERVER STARTED SUCCESSFULLY!');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
  } else {
    console.error('❌ Server error:', error.message);
  }
  process.exit(1);
});

