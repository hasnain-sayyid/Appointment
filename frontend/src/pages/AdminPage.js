import React, { useState } from 'react';
import AppointmentList from '../components/AppointmentList';
import './AdminPage.css';

function AdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Sharp Culture Schedule</h2>
        <p>Manage all appointments and view the daily schedule</p>
      </div>

      <AppointmentList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default AdminPage;
