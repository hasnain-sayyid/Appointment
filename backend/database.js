const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use in-memory database on Render (no file system access)
// Use file-based database in development
const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction ? ':memory:' : path.join(__dirname, 'appointments.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Database connected successfully');
  }
});

// Available time slots (9 AM to 5 PM)
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];

// Services offered
const SERVICES = [
  { id: 1, name: 'Haircut', duration: 30, price: 25 },
  { id: 2, name: 'Shave', duration: 20, price: 15 },
  { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
  { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
];

module.exports = {
  init: function() {
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        service TEXT NOT NULL,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Database table initialized successfully');
      }
    });
  },

  getAppointmentsByDate: function(date, callback) {
    db.all(
      'SELECT * FROM appointments WHERE date = ? ORDER BY time ASC',
      [date],
      callback
    );
  },

  getAppointmentById: function(id, callback) {
    db.get(
      'SELECT * FROM appointments WHERE id = ?',
      [id],
      callback
    );
  },

  createAppointment: function(customerName, customerPhone, date, time, service, notes, callback) {
    db.run(
      'INSERT INTO appointments (customerName, customerPhone, date, time, service, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [customerName, customerPhone, date, time, service, notes || ''],
      function(err) {
        callback(err, this.lastID);
      }
    );
  },

  updateAppointment: function(id, customerName, customerPhone, date, time, service, notes, callback) {
    db.run(
      'UPDATE appointments SET customerName = ?, customerPhone = ?, date = ?, time = ?, service = ?, notes = ? WHERE id = ?',
      [customerName, customerPhone, date, time, service, notes || '', id],
      callback
    );
  },

  deleteAppointment: function(id, callback) {
    db.run(
      'DELETE FROM appointments WHERE id = ?',
      [id],
      callback
    );
  },

  getAvailableTimes: function(date, callback) {
    db.all(
      'SELECT time FROM appointments WHERE date = ?',
      [date],
      (err, bookedAppointments) => {
        if (err) {
          return callback(err, null);
        }

        const bookedTimes = bookedAppointments.map(apt => apt.time);
        const availableTimes = TIME_SLOTS.filter(time => !bookedTimes.includes(time));
        
        callback(null, availableTimes);
      }
    );
  },

  getServices: function() {
    return SERVICES;
  }
};
