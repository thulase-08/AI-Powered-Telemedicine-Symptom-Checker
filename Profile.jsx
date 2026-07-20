import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { User, Activity, CalendarClock, Bot } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, predictionsData] = await Promise.all([
          apiClient('/profile'),
          apiClient('/predictions').catch(() => []) // Fallback in case of err
        ]);
        setProfile(profileData);
        setPredictions(predictionsData);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="page-container"><p>Loading profile...</p></div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User /> My Profile
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
        {/* Profile Details Sidebar */}
        <div className="card" style={{ position: 'sticky', top: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <User size={40} color="var(--primary-color)" />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>{profile?.name || 'User'}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Patient</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Email Address</label>
              <strong>{profile?.email}</strong>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Phone Number</label>
              <strong>{profile?.phone}</strong>
            </div>
          </div>
        </div>

        {/* Previous Predictions */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot color="var(--primary-color)" /> AI Prediction History
          </h2>

          {predictions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
              <Activity size={40} color="var(--text-secondary)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-secondary)' }}>No prediction history found.</p>
              <a href="/symptom-checker" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex', textDecoration: 'none' }}>Try AI Checker</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {predictions.map((pred) => (
                <div key={pred.id} style={{ 
                  padding: '1.25rem', 
                  background: 'var(--bg-primary)', 
                  borderRadius: '12px',
                  borderLeft: '4px solid var(--primary-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-color)' }}>{pred.disease || 'Unknown'}</h3>
                    <span style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                      <CalendarClock size={14} /> {new Date(pred.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    <strong>Symptoms:</strong> <span style={{ color: 'var(--text-secondary)' }}>{pred.symptoms}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ flex: 1, height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${pred.confidence * 100}%`, 
                        background: pred.confidence > 0.7 ? 'var(--success-color)' : pred.confidence > 0.4 ? 'var(--warning-color)' : 'var(--error-color)' 
                      }} />
                    </div>
                    <strong>{(pred.confidence * 100).toFixed(0)}% Confidence</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
