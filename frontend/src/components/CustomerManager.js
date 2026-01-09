import React, { useState, useEffect } from 'react';
import api from '../api';
import './CustomerManager.css';

function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/customers');
      setCustomers(response.data);
    } catch (error) {
      setMessage('Error fetching customers');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getCustomerStats = (customer) => {
    return {
      totalAppointments: customer.appointments?.length || 0,
      lastVisit: customer.appointments?.length > 0 
        ? new Date(customer.appointments[customer.appointments.length - 1].date).toLocaleDateString()
        : 'Never',
      favoriteService: customer.appointments?.length > 0 
        ? getMostFrequentService(customer.appointments)
        : 'None'
    };
  };

  const getMostFrequentService = (appointments) => {
    const serviceCounts = {};
    appointments.forEach(apt => {
      serviceCounts[apt.service] = (serviceCounts[apt.service] || 0) + 1;
    });
    return Object.keys(serviceCounts).reduce((a, b) => 
      serviceCounts[a] > serviceCounts[b] ? a : b
    );
  };

  return (
    <div className="customer-manager">
      <div className="customer-header">
        <h2>Customer Management</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="customer-content">
        <div className="customer-list">
          <h3>Customers ({filteredCustomers.length})</h3>
          {loading ? (
            <div className="loading">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="no-customers">No customers found</div>
          ) : (
            <div className="customer-grid">
              {filteredCustomers.map(customer => {
                const stats = getCustomerStats(customer);
                return (
                  <div 
                    key={customer.id} 
                    className={`customer-card ${selectedCustomer?.id === customer.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="customer-name">{customer.name}</div>
                    <div className="customer-phone">{customer.phone}</div>
                    <div className="customer-stats">
                      <span className="stat">
                        <strong>{stats.totalAppointments}</strong> visits
                      </span>
                      <span className="stat">
                        Last: <strong>{stats.lastVisit}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedCustomer && (
          <div className="customer-details">
            <h3>Customer Details</h3>
            <div className="customer-info">
              <h4>{selectedCustomer.name}</h4>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Total Visits:</strong> {getCustomerStats(selectedCustomer).totalAppointments}</p>
              <p><strong>Favorite Service:</strong> {getCustomerStats(selectedCustomer).favoriteService}</p>
              <p><strong>Last Visit:</strong> {getCustomerStats(selectedCustomer).lastVisit}</p>
            </div>

            <div className="appointment-history">
              <h4>Appointment History</h4>
              {selectedCustomer.appointments?.length > 0 ? (
                <div className="appointment-list">
                  {selectedCustomer.appointments.map((apt, index) => (
                    <div key={index} className="appointment-item">
                      <span className="apt-date">{new Date(apt.date).toLocaleDateString()}</span>
                      <span className="apt-time">{apt.time}</span>
                      <span className="apt-service">{apt.service}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No appointment history</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerManager;