import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <img src="/logo.svg" alt="Sharp Culture Barbershop" style={{height: '150px', width: 'auto'}} />
        </div>
      </header>

      <nav className="nav-buttons" style={{textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
        <button 
          className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => {
            setCurrentPage('home');
            // Smooth scroll to booking form after a short delay
            setTimeout(() => {
              const bookingSection = document.getElementById('booking-section');
              if (bookingSection) {
                bookingSection.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }, 100);
          }}
        >
          Book Appointment
        </button>
        <button 
          className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}
          onClick={() => setCurrentPage('admin')}
        >
          Schedule
        </button>
      </nav>

      <main className="app-main">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'admin' && <AdminPage />}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Sharp Culture Barbershop. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
