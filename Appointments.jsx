import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Video, Calendar } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiClient('/history');
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="page-container">
      <h1 style={{ color: 'var(--primary-color)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar /> My Appointments
      </h1>

      {loading ? (
        <p>Loading your appointments...</p>
      ) : appointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You don't have any appointments yet.</p>
          <a href="/doctors" className="btn btn-primary" style={{ textDecoration: 'none' }}>Book an Appointment</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map((apt) => (
            <div key={apt.appointment_id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{apt.doctor_name.startsWith('Dr.') ? apt.doctor_name : `Dr. ${apt.doctor_name}`}</h3>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '0.5rem' }}>{apt.specialization}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                  <span style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Date: {apt.date}</span>
                  <span style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Time: {apt.time}</span>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    background: apt.status === 'confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: apt.status === 'confirmed' ? 'var(--success-color)' : 'var(--error-color)',
                    textTransform: 'capitalize',
                    fontWeight: 'bold'
                  }}>
                    {apt.status}
                  </span>
                </div>
              </div>
              
              <div>
                {apt.video_link && apt.status === 'confirmed' && (
                  <a href={apt.video_link} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    <Video size={18} /> Join Meeting
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
