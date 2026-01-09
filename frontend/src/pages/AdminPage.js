import React, { useState } from 'react';
import AppointmentList from '../components/AppointmentList';
import CustomerManager from '../components/CustomerManager';
import BusinessDashboard from '../components/BusinessDashboard';
import './AdminPage.css';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'schedule':
        return <AppointmentList refreshTrigger={refreshTrigger} />;
      case 'customers':
        return <CustomerManager />;
      case 'dashboard':
        return <BusinessDashboard />;
      default:
        return <AppointmentList refreshTrigger={refreshTrigger} />;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Sharp Culture Admin</h2>
        <p>Comprehensive business management tools</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        <button 
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          👥 Customers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage;
