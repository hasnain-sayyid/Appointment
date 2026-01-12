const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for appointments
let appointments = [];

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sharpculture.barbershop@gmail.com', // Demo email (you'd use environment variables in production)
    pass: 'demo_app_password' // App-specific password (would be in environment variables)
  }
});

// Email templates
const createAppointmentEmailHTML = (appointment) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
      <div style="background: white; border-radius: 10px; padding: 30px;">
        <h1 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">
          🏪 SHARP CULTURE BARBERSHOP
        </h1>
        <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
          ✅ New Appointment Booked
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Customer Details:</h3>
          <p><strong>Name:</strong> ${appointment.customerName}</p>
          <p><strong>Phone:</strong> ${appointment.customerPhone}</p>
          <p><strong>Email:</strong> ${appointment.customerEmail}</p>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Appointment Details:</h3>
          <p><strong>Service:</strong> ${appointment.service}</p>
          <p><strong>Date:</strong> ${appointment.date}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            Appointment ID: #${appointment.id}<br>
            Booked on: ${appointment.createdAt}
          </p>
        </div>
      </div>
    </div>
  `;
};

// Function to send appointment notification email
const sendAppointmentEmail = async (appointment) => {
  try {
    const mailOptions = {
      from: 'SHARP CULTURE BARBERSHOP <sharpculture.barbershop@gmail.com>',
      to: 'hasnain.sayyid@pursuit.org',
      subject: `🏪 New Appointment - ${appointment.customerName} (${appointment.date} at ${appointment.time})`,
      html: createAppointmentEmailHTML(appointment)
    };

    // Note: In demo mode, we'll just log the email instead of actually sending it
    console.log('📧 Email would be sent:', mailOptions.subject);
    console.log('📧 To:', mailOptions.to);
    console.log('📧 Customer:', appointment.customerName, appointment.customerEmail);
    
    // Uncomment below for actual email sending (requires real email credentials)
    // await transporter.sendMail(mailOptions);
    
    return { success: true, message: 'Email notification logged (demo mode)' };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, message: error.message };
  }
};

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://appointment-frontend.onrender.com', 'https://appointment-5lm4.onrender.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    appointments: appointments.length
  });
});

app.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '🏪 Barber Appointment Scheduler API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      ping: '/ping',
      services: '/api/services',  
      appointments: '/api/appointments',
      availableTimes: '/api/available-times',
      customers: '/api/customers',
      login: '/api/auth/login'
    },
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    deployment: 'render-ready'
  });
});

app.get('/api/services', (req, res) => res.json([
  { id: 1, name: 'Haircut', duration: 30, price: 25 },
  { id: 2, name: 'Shave', duration: 20, price: 15 },
  { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
  { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
]));

app.get('/api/available-times', (req, res) => res.json(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']));

app.post('/api/appointments', async (req, res) => {
  const { customerName, customerPhone, customerEmail, date, time, service, notes } = req.body;
  
  const newAppointment = {
    id: Date.now(),
    customerName,
    customerPhone,
    customerEmail,
    date,
    time,
    service,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  console.log('New appointment created:', newAppointment);
  console.log('Total appointments:', appointments.length);
  
  // Send email notification
  const emailResult = await sendAppointmentEmail(newAppointment);
  console.log('Email notification result:', emailResult);
  
  res.json({ 
    id: newAppointment.id, 
    status: 'success',
    emailSent: emailResult.success
  });
});

app.get('/api/appointments', (req, res) => {
  console.log('Getting appointments:', appointments);
  const { date } = req.query;
  
  if (date) {
    const filtered = appointments.filter(apt => apt.date === date);
    console.log(`Appointments for ${date}:`, filtered);
    res.json(filtered);
  } else {
    res.json(appointments);
  }
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { customerName, customerPhone, customerEmail, date, time, service, notes } = req.body;
  
  const index = appointments.findIndex(apt => apt.id == id);
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  appointments[index] = {
    ...appointments[index],
    customerName,
    customerPhone,
    customerEmail,
    date,
    time,
    service,
    notes: notes || '',
    updatedAt: new Date().toISOString()
  };
  
  console.log('Updated appointment:', appointments[index]);
  res.json({ status: 'success', appointment: appointments[index] });
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  
  const index = appointments.findIndex(apt => apt.id == id);
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  const deleted = appointments.splice(index, 1)[0];
  console.log('Deleted appointment:', deleted);
  console.log('Remaining appointments:', appointments.length);
  
  res.json({ status: 'success', deleted: deleted });
});

// Get customers with appointment history
app.get('/api/customers', (req, res) => {
  const customerMap = {};
  
  appointments.forEach(apt => {
    const customerId = apt.customerPhone; // Using phone as unique ID
    
    if (!customerMap[customerId]) {
      customerMap[customerId] = {
        id: customerId,
        name: apt.customerName,
        phone: apt.customerPhone,
        appointments: []
      };
    }
    
    customerMap[customerId].appointments.push({
      id: apt.id,
      date: apt.date,
      time: apt.time,
      service: apt.service,
      notes: apt.notes
    });
  });
  
  // Sort appointments by date for each customer
  Object.values(customerMap).forEach(customer => {
    customer.appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  
  const customers = Object.values(customerMap);
  console.log(`Returning ${customers.length} customers`);
  res.json(customers);
});

// Export appointments as CSV
app.get('/api/export/csv', (req, res) => {
  const csvHeader = 'Date,Time,Customer Name,Phone,Email,Service,Notes,Created At\n';
  const csvRows = appointments.map(apt => {
    return `"${apt.date}","${apt.time}","${apt.customerName}","${apt.customerPhone}","${apt.customerEmail || ''}","${apt.service}","${apt.notes || ''}","${apt.createdAt}"`;
  }).join('\n');
  
  const csv = csvHeader + csvRows;
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="appointments.csv"');
  res.send(csv);
});

// Admin authentication endpoints
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'barbershop2026'
};

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        username: ADMIN_CREDENTIALS.username,
        role: 'admin',
        sessionToken,
        loginTime: new Date().toISOString()
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
});

app.post('/api/auth/verify', (req, res) => {
  const { sessionToken, username } = req.body;
  
  // Basic session validation (in production, use proper JWT or database sessions)
  if (sessionToken && username === ADMIN_CREDENTIALS.username) {
    res.json({
      success: true,
      valid: true,
      user: {
        username: ADMIN_CREDENTIALS.username,
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      valid: false,
      message: 'Invalid session'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log('Backend running on ' + PORT));

