const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
console.log('📦 Initializing database...');
db.init();

// Simple health check
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Ping endpoint
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
        console.error('Error fetching appointments:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(appointments || []);
    });
  } catch (error) {
    console.error('Exception in GET /api/appointments:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  try {
    db.getAppointmentById(req.params.id, (err, appointment) => {
      if (err) {
        console.error('Error fetching appointment:', err.message);
        return res.status(500).json({ error: err.message });
      }
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    });
  } catch (error) {
    console.error('Exception in GET /api/appointments/:id:', error.message);
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

    db.createAppointment(customerName, customerPhone, date, time, service, notes, (err, appointmentId) => {
      if (err) {
        console.error('Error creating appointment:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: appointmentId, message: 'Appointment created successfully' });
    });
  } catch (error) {
    console.error('Exception in POST /api/appointments:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  try {
    const { customerName, customerPhone, date, time, service, notes } = req.body;

    db.updateAppointment(req.params.id, customerName, customerPhone, date, time, service, notes, (err) => {
      if (err) {
        console.error('Error updating appointment:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Appointment updated successfully' });
    });
  } catch (error) {
    console.error('Exception in PUT /api/appointments/:id:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  try {
    db.deleteAppointment(req.params.id, (err) => {
      if (err) {
        console.error('Error deleting appointment:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Appointment deleted successfully' });
    });
  } catch (error) {
    console.error('Exception in DELETE /api/appointments/:id:', error.message);
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
        console.error('Error fetching available times:', err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(times || []);
    });
  } catch (error) {
    console.error('Exception in GET /api/available-times:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get services
app.get('/api/services', (req, res) => {
  try {
    const services = db.getServices();
    res.json(services || []);
  } catch (error) {
    console.error('Exception in GET /api/services:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Global uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('🔴 UNCAUGHT EXCEPTION:', error.message);
  console.error('Stack:', error.stack);
});

// Global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 UNHANDLED REJECTION:', reason);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n✅ SERVER STARTED SUCCESSFULLY!');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health\n`);
});

server.on('error', (error) => {
  console.error('❌ Server startup error:', error.message);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

