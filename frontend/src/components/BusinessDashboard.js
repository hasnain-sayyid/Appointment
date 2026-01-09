import React, { useState, useEffect } from 'react';
import api from '../api';
import './BusinessDashboard.css';

function BusinessDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weeklyAppointments: 0,
    monthlyAppointments: 0,
    totalCustomers: 0,
    popularService: 'N/A',
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const SERVICE_PRICES = {
    'Haircut': 25,
    'Shave': 15,
    'Haircut + Shave': 35,
    'Beard Trim': 10
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all appointments
      const appointmentsResponse = await api.get('/api/appointments');
      const allAppointments = appointmentsResponse.data;

      // Fetch customers
      const customersResponse = await api.get('/api/customers');
      const customers = customersResponse.data;

      calculateStats(allAppointments, customers);
      setRecentAppointments(allAppointments.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointments, customers) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayApts = appointments.filter(apt => apt.date === today);
    const weeklyApts = appointments.filter(apt => new Date(apt.date) >= weekStart);
    const monthlyApts = appointments.filter(apt => new Date(apt.date) >= monthStart);

    // Calculate revenue
    const calculateRevenue = (apts) => {
      return apts.reduce((total, apt) => {
        return total + (SERVICE_PRICES[apt.service] || 0);
      }, 0);
    };

    // Find most popular service
    const serviceCounts = {};
    appointments.forEach(apt => {
      serviceCounts[apt.service] = (serviceCounts[apt.service] || 0) + 1;
    });
    const popularService = Object.keys(serviceCounts).reduce((a, b) => 
      serviceCounts[a] > serviceCounts[b] ? a : b, 'N/A'
    );

    setStats({
      todayAppointments: todayApts.length,
      weeklyAppointments: weeklyApts.length,
      monthlyAppointments: monthlyApts.length,
      totalCustomers: customers.length,
      popularService,
      todayRevenue: calculateRevenue(todayApts),
      weeklyRevenue: calculateRevenue(weeklyApts),
      monthlyRevenue: calculateRevenue(monthlyApts)
    });
  };

  const exportData = async () => {
    try {
      const response = await api.get('/api/export/csv');
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="business-dashboard">
      <div className="dashboard-header">
        <h2>Business Dashboard</h2>
        <button className="export-btn" onClick={exportData}>
          📊 Export Data (CSV)
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card appointments">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Today's Appointments</h3>
            <div className="stat-number">{stats.todayAppointments}</div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Today's Revenue</h3>
            <div className="stat-number">${stats.todayRevenue}</div>
          </div>
        </div>

        <div className="stat-card weekly">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Weekly Appointments</h3>
            <div className="stat-number">{stats.weeklyAppointments}</div>
          </div>
        </div>

        <div className="stat-card customers">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Customers</h3>
            <div className="stat-number">{stats.totalCustomers}</div>
          </div>
        </div>

        <div className="stat-card service">
          <div className="stat-icon">✂️</div>
          <div className="stat-info">
            <h3>Popular Service</h3>
            <div className="stat-text">{stats.popularService}</div>
          </div>
        </div>

        <div className="stat-card monthly">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>Monthly Revenue</h3>
            <div className="stat-number">${stats.monthlyRevenue}</div>
          </div>
        </div>
      </div>

      <div className="recent-appointments">
        <h3>Recent Appointments</h3>
        {recentAppointments.length === 0 ? (
          <div className="no-appointments">No recent appointments</div>
        ) : (
          <div className="appointment-list">
            {recentAppointments.map((apt, index) => (
              <div key={index} className="appointment-row">
                <div className="apt-customer">{apt.customerName}</div>
                <div className="apt-service">{apt.service}</div>
                <div className="apt-datetime">
                  {new Date(apt.date).toLocaleDateString()} at {apt.time}
                </div>
                <div className="apt-price">${SERVICE_PRICES[apt.service] || 0}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessDashboard;