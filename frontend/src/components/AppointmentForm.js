import React, { useState } from 'react';
import axios from 'axios';
import './AppointmentForm.css';

const SERVICES = [
  { id: 1, name: 'Haircut', duration: 30, price: 25 },
  { id: 2, name: 'Shave', duration: 20, price: 15 },
  { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
  { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
];

function AppointmentForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    service: '',
    notes: ''
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData({ ...formData, date, time: '' });
    fetchAvailableTimes(date);
  };

  const fetchAvailableTimes = async (date) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/available-times?date=${date}`);
      setAvailableTimes(response.data);
    } catch (error) {
      setMessage('Error fetching available times');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/api/appointments', formData);
      setMessage('✓ Appointment booked successfully!');
      setFormData({
        customerName: '',
        customerPhone: '',
        date: '',
        time: '',
        service: '',
        notes: ''
      });
      setAvailableTimes([]);
      
      if (onSubmitSuccess) {
        setTimeout(onSubmitSuccess, 1500);
      }
    } catch (error) {
      setMessage('✗ Error booking appointment: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const selectedService = SERVICES.find(s => s.id === parseInt(formData.service));
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="appointment-form">
        <h2>Book Your Appointment</h2>

        <div className="form-group">
          <label htmlFor="customerName">Full Name *</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerPhone">Phone Number *</label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="service">Service *</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            {SERVICES.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price} ({service.duration} min)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            min={minDate}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time *</label>
          {formData.date ? (
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">
                {loading ? 'Loading times...' : 'Select a time'}
              </option>
              {availableTimes.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Select a date first"
              disabled
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requests or preferences..."
            rows="3"
          />
        </div>

        {selectedService && (
          <div className="service-summary">
            <p><strong>Service:</strong> {selectedService.name}</p>
            <p><strong>Duration:</strong> {selectedService.duration} minutes</p>
            <p><strong>Price:</strong> ${selectedService.price}</p>
          </div>
        )}

        {message && (
          <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

export default AppointmentForm;
