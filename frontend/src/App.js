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
          <h1>✂️ Barber Shop</h1>
          <p>Premium Grooming Services</p>
        </div>
        <nav className="nav-buttons">
          <button 
            className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentPage('home')}
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
      </header>

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
