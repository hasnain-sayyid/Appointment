const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for appointments
let appointments = [];

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

app.post('/api/appointments', (req, res) => {
  const { customerName, customerPhone, date, time, service, notes } = req.body;
  
  const newAppointment = {
    id: Date.now(),
    customerName,
    customerPhone,
    date,
    time,
    service,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  console.log('New appointment created:', newAppointment);
  console.log('Total appointments:', appointments.length);
  
  res.json({ id: newAppointment.id, status: 'success' });
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
  const { customerName, customerPhone, date, time, service, notes } = req.body;
  
  const index = appointments.findIndex(apt => apt.id == id);
  if (index === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }
  
  appointments[index] = {
    ...appointments[index],
    customerName,
    customerPhone,
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
  const csvHeader = 'Date,Time,Customer Name,Phone,Service,Notes,Created At\n';
  const csvRows = appointments.map(apt => {
    return `"${apt.date}","${apt.time}","${apt.customerName}","${apt.customerPhone}","${apt.service}","${apt.notes || ''}","${apt.createdAt}"`;
  }).join('\n');
  
  const csv = csvHeader + csvRows;
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="appointments.csv"');
  res.send(csv);
});

app.listen(PORT, '0.0.0.0', () => console.log('Backend running on ' + PORT));

