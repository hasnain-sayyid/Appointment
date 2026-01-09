import React from 'react';
import AppointmentForm from '../components/AppointmentForm';
import './HomePage.css';

function HomePage() {
  const handleSubmitSuccess = () => {
    // Handle success if needed
  };

  return (
    <div className="home-page">
      <div className="info-section">
        <h2>Welcome to SHARP CULTURE BARBERSHOP</h2>
        <p>Book your appointment in just a few clicks. We offer premium grooming services with experienced barbers.</p>
        
        <div className="services-showcase">
          <div className="service-item">
            <span className="service-icon">✂️</span>
            <h3>Haircut</h3>
            <p>Professional haircuts tailored to your style</p>
          </div>
          <div className="service-item">
            <span className="service-icon">🪮</span>
            <h3>Shave</h3>
            <p>Classic straight razor shaves</p>
          </div>
          <div className="service-item">
            <span className="service-icon">✨</span>
            <h3>Premium Services</h3>
            <p>Haircut + Shave and beard treatments</p>
          </div>
        </div>
      </div>

      <div id="booking-section">
        <AppointmentForm onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
}

export default HomePage;
