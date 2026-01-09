import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './components/AdminLogin';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);

  // Check if admin is already authenticated on app load
  useEffect(() => {
    const storedCredentials = localStorage.getItem('adminAuth');
    if (storedCredentials) {
      try {
        const credentials = JSON.parse(storedCredentials);
        const now = Date.now();
        // Check if session hasn't expired (24 hours)
        if (credentials.timestamp && (now - credentials.timestamp) < 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
          setAdminCredentials(credentials);
        } else {
          // Clear expired session
          localStorage.removeItem('adminAuth');
        }
      } catch (error) {
        console.error('Error parsing admin credentials:', error);
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const handleLogin = (credentials) => {
    setIsAuthenticated(true);
    setAdminCredentials(credentials);
    setShowAdminLogin(false);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminCredentials(null);
    localStorage.removeItem('adminAuth');
    setCurrentPage('home');
  };

  const handleScheduleClick = () => {
    if (isAuthenticated) {
      setCurrentPage('admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          {isAuthenticated && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              color: '#D4AF37',
              fontSize: '14px'
            }}>
              <span>Welcome, {adminCredentials?.username}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(212, 175, 55, 0.2)',
                  color: '#D4AF37',
                  border: '1px solid #D4AF37',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Logout
              </button>
            </div>
          )}
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
          className={`nav-btn ${currentPage === 'admin' && isAuthenticated ? 'active' : ''}`}
          onClick={handleScheduleClick}
        >
          {isAuthenticated ? 'Admin Panel' : 'Staff Login'}
        </button>
      </nav>

      <main className="app-main">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'admin' && isAuthenticated && <AdminPage />}
        {currentPage === 'admin' && !isAuthenticated && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666'
          }}>
            <h2>Access Restricted</h2>
            <p>Please log in to access the admin panel.</p>
            <button 
              className="nav-btn"
              onClick={() => setShowAdminLogin(true)}
              style={{marginTop: '20px'}}
            >
              Staff Login
            </button>
          </div>
        )}
      </main>

      {showAdminLogin && (
        <AdminLogin
          onLogin={handleLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      <footer className="app-footer">
        <p>&copy; 2026 SHARP CULTURE BARBERSHOP. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
