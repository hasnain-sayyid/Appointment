# Barber Shop Appointment Scheduler

A modern, full-stack web application for managing barber shop appointments with both customer booking and admin schedule management features.

---

## 🚀 Deploy Online in 15 Minutes!

Want to share this with your shop customers? Deploy it **FREE** on Render.com!

📖 **[👉 See Deployment Guide](DEPLOYMENT_GUIDE.md)** - Step-by-step instructions

Or run locally: `start.bat` then visit http://localhost:3000

---

## Features

✨ **Customer Features:**
- Easy-to-use appointment booking interface
- Real-time availability checking
- Multiple service options with pricing
- Customer information storage
- Special requests/notes field

🔧 **Admin Features:**
- View all appointments by date
- Edit existing appointments
- Delete appointments
- Real-time schedule updates
- Professional dashboard interface

🎨 **User Interface:**
- Modern, clean design with gradient styling
- Responsive layout (works on desktop and mobile)
- Smooth animations and transitions
- Intuitive navigation

## Project Structure

```
Appointment Scheduler/
├── backend/
│   ├── package.json
│   ├── server.js          # Express server entry point
│   └── database.js        # SQLite database setup and queries
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AppointmentForm.js
    │   │   ├── AppointmentForm.css
    │   │   ├── AppointmentList.js
    │   │   └── AppointmentList.css
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   ├── HomePage.css
    │   │   ├── AdminPage.js
    │   │   └── AdminPage.css
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   ├── index.css
    │   └── package.json
    └── README.md
```

## Technologies Used

**Backend:**
- Node.js
- Express.js
- SQLite3 (lightweight database)
- CORS for cross-origin requests

**Frontend:**
- React 18
- Axios for HTTP requests
- CSS3 with gradients and animations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

## API Endpoints

### Appointments
- **GET** `/api/appointments?date=YYYY-MM-DD` - Get all appointments for a date
- **GET** `/api/appointments/:id` - Get a specific appointment
- **POST** `/api/appointments` - Create a new appointment
- **PUT** `/api/appointments/:id` - Update an appointment
- **DELETE** `/api/appointments/:id` - Delete an appointment

### Availability
- **GET** `/api/available-times?date=YYYY-MM-DD` - Get available time slots for a date

## Services Offered

1. **Haircut** - $25 (30 min)
2. **Shave** - $15 (20 min)
3. **Haircut + Shave** - $35 (50 min)
4. **Beard Trim** - $10 (15 min)

## Available Time Slots

The barber shop operates from 9:00 AM to 5:00 PM with 30-minute intervals:
- 9:00, 9:30, 10:00, 10:30, 11:00, 11:30
- 12:00, 12:30, 13:00, 13:30, 14:00, 14:30
- 15:00, 15:30, 16:00, 16:30, 17:00

## Usage

### Booking an Appointment (Home Page)
1. Click on "Book Appointment" tab
2. Enter your name and phone number
3. Select a service from the dropdown
4. Choose a date (today or later)
5. Select an available time slot
6. Optionally add special notes
7. Click "Book Appointment"

### Managing Schedule (Schedule Tab)
1. Click on "Schedule" tab
2. Use the date picker to view appointments for any date
3. Edit appointments by clicking "Edit" button
4. Delete appointments by clicking "Delete" button

## Customization

### Change Services
Edit the `SERVICES` array in:
- `backend/database.js` (for database)
- `frontend/src/components/AppointmentForm.js` (for booking form)
- `frontend/src/components/AppointmentList.js` (for display)

### Change Operating Hours
Edit the `TIME_SLOTS` array in `backend/database.js`

### Styling
Modify CSS files in `frontend/src/` to customize colors, fonts, and layouts.

## Database

The application uses SQLite3, which stores data in `backend/appointments.db`. The database automatically creates the necessary tables on first run.

## Notes

- The application prevents double-booking by showing only available time slots
- Past dates cannot be selected for new appointments
- All times are stored in 24-hour format
- No authentication required (suitable for internal use)

## Future Enhancements

- User authentication and customer profiles
- Email/SMS notifications
- Multiple barber staff management
- Recurring appointments
- Payment processing
- Rating and review system
- Admin dashboard analytics

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the project repository.
