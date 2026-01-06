const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Detect production (Render)
const isProduction = process.env.NODE_ENV === 'production';

// In production, use /tmp (writable on Render)
const dbPath = isProduction
  ? path.join('/tmp', 'appointments.db')
  : path.join(__dirname, 'appointments.db');

console.log('📁 Using database at:', dbPath);

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Time slots
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
];

// Services
const SERVICES = [
  { id: 1, name: 'Haircut', duration: 30, price: 25 },
  { id: 2, name: 'Shave', duration: 20, price: 15 },
  { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
  { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
];

module.exports = {
  init: function () {
    console.log('🛠 Initializing database schema...');

    // Synchronous table creation to avoid startup crashes
    db.serialize(() => {
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
          console.error('❌ Error creating table:', err.message);
        } else {
          console.log('✅ Table ready');
        }
      });
    });
  },

  getAppointmentsByDate: function (date, callback) {
    db.all(
      'SELECT * FROM appointments WHERE date = ? ORDER BY time ASC',
      [date],
      callback
    );
  },

  getAppointmentById: function (id, callback) {
    db.get(
      'SELECT * FROM appointments WHERE id = ?',
      [id],
      callback
    );
  },

  createAppointment: function (customerName, customerPhone, date, time, service, notes, callback) {
    db.run(
      'INSERT INTO appointments (customerName, customerPhone, date, time, service, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [customerName, customerPhone, date, time, service, notes || ''],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  },

  updateAppointment: function (id, customerName, customerPhone, date, time, service, notes, callback) {
    db.run(
      'UPDATE appointments SET customerName = ?, customerPhone = ?, date = ?, time = ?, service = ?, notes = ? WHERE id = ?',
      [customerName, customerPhone, date, time, service, notes || '', id],
      callback
    );
  },

  deleteAppointment: function (id, callback) {
    db.run(
      'DELETE FROM appointments WHERE id = ?',
      [id],
      callback
    );
  },

  getAvailableTimes: function (date, callback) {
    db.all(
      'SELECT time FROM appointments WHERE date = ?',
      [date],
      (err, bookedAppointments) => {
        if (err) return callback(err, null);

        const bookedTimes = bookedAppointments.map(a => a.time);
        const availableTimes = TIME_SLOTS.filter(t => !bookedTimes.includes(t));

        callback(null, availableTimes);
      }
    );
  },

  getServices: function () {
    return SERVICES;
  }
};
