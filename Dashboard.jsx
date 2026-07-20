import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Calendar, Clock, Heart, Shield, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/client';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [profileData, aptData] = await Promise.all([
        apiClient('/profile'),
        apiClient('/appointments')
      ]);
      setProfile(profileData);
      setAppointments(aptData || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const upcomingCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: '60px', width: '60%', marginBottom: '2rem' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '200px' }}></div>)}
        </div>
      </div>
    );
  }

  const firstName = profile?.name?.split(' ')[0] || 'Patient';

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            {getGreeting()} 👋
          </p>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>
            {firstName}
          </h1>
          <p style={{ opacity: 0.85, fontSize: '0.875rem' }}>
            Take control of your health journey. How can we help you today?
          </p>
        </div>
        <Heart size={120} style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.15 }} />
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>Your Stats</h2>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          style={{
            background: 'none',
            border: 'none',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            color: 'var(--primary-color)',
            opacity: refreshing ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            padding: '0.5rem'
          }}
        >
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
            <Calendar size={24} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{upcomingCount}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Upcoming</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px' }}>
            <Clock size={24} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{completedCount}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Completed</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
            <Shield size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>100%</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Secure</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '600' }}>Quick Actions</h2>

      <div className="grid-responsive">
        <Link to="/symptom-checker" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
              <Activity size={48} color="var(--primary-color)" />
            </div>
            <h3>AI Symptom Checker</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Describe your symptoms and our AI will provide instant insights and recommendations.</p>
          </div>
        </Link>

        <Link to="/doctors" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%' }}>
              <Users size={48} color="var(--secondary-color)" />
            </div>
            <h3>Find a Doctor</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Browse top-rated specialists and book video consultations.</p>
          </div>
        </Link>

        <Link to="/appointments" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%' }}>
              <Calendar size={48} color="var(--success-color)" />
            </div>
            <h3>My Appointments</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>View your upcoming and past consultations, and join video meets.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
