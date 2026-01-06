import React, { useState, useEffect } from 'react';
import api from '../api';
import './AppointmentList.css';

function AppointmentList({ refreshTrigger }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [message, setMessage] = useState('');

  const SERVICES = [
    { id: 1, name: 'Haircut', duration: 30, price: 25 },
    { id: 2, name: 'Shave', duration: 20, price: 15 },
    { id: 3, name: 'Haircut + Shave', duration: 50, price: 35 },
    { id: 4, name: 'Beard Trim', duration: 15, price: 10 }
  ];

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, refreshTrigger]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/appointments?date=${selectedDate}`);
      setAppointments(response.data);
    } catch (error) {
      setMessage('Error fetching appointments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/api/appointments/${id}`);
        setMessage('✓ Appointment deleted successfully!');
        setTimeout(fetchAppointments, 500);
      } catch (error) {
        setMessage('✗ Error deleting appointment');
      }
    }
  };

  const handleEditStart = (appointment) => {
    setEditingId(appointment.id);
    setEditFormData(appointment);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/api/appointments/${id}`, editFormData);
      setMessage('✓ Appointment updated successfully!');
      setEditingId(null);
      setTimeout(fetchAppointments, 500);
    } catch (error) {
      setMessage('✗ Error updating appointment');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const getServiceName = (serviceId) => {
    const service = SERVICES.find(s => s.id === parseInt(serviceId));
    return service ? service.name : serviceId;
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="appointments-list-container">
      <div className="list-header">
        <h2>Daily Schedule</h2>
        <div className="date-selector">
          <label htmlFor="dateSelect">View appointments for:</label>
          <input
            type="date"
            id="dateSelect"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate}
          />
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="no-appointments">
          <p>No appointments scheduled for {new Date(selectedDate).toLocaleDateString()}</p>
        </div>
      ) : (
        <div className="appointments-grid">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              {editingId === appointment.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="customerName"
                    value={editFormData.customerName}
                    onChange={handleEditChange}
                    placeholder="Name"
                  />
                  <input
                    type="tel"
                    name="customerPhone"
                    value={editFormData.customerPhone}
                    onChange={handleEditChange}
                    placeholder="Phone"
                  />
                  <input
                    type="time"
                    name="time"
                    value={editFormData.time}
                    onChange={handleEditChange}
                  />
                  <select
                    name="service"
                    value={editFormData.service}
                    onChange={handleEditChange}
                  >
                    {SERVICES.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="notes"
                    value={editFormData.notes}
                    onChange={handleEditChange}
                    placeholder="Notes"
                  />
                  <div className="edit-buttons">
                    <button className="save-btn" onClick={() => handleEditSave(appointment.id)}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={handleEditCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-header">
                    <div className="time-badge">{appointment.time}</div>
                    <span className="service-tag">{getServiceName(appointment.service)}</span>
                  </div>
                  <div className="card-body">
                    <p className="customer-name">{appointment.customerName}</p>
                    <p className="customer-phone">📞 {appointment.customerPhone}</p>
                    {appointment.notes && (
                      <p className="notes">📝 {appointment.notes}</p>
                    )}
                  </div>
                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => handleEditStart(appointment)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(appointment.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
