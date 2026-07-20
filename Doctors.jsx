import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Search, MapPin, Star } from 'lucide-react';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', area: '', specialization: '' });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await apiClient('/doctors', {
        method: 'POST',
        body: JSON.stringify(filters)
      });
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>Find a Specialist</h1>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '12px', boxShadow: 'var(--glass-shadow)', flexWrap: 'wrap', width: '100%', maxWidth: '600px' }}>
          <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleFilterChange} style={{ flex: 1, minWidth: '100px' }} />
          <input type="text" name="area" placeholder="Area" value={filters.area} onChange={handleFilterChange} style={{ flex: 1, minWidth: '100px' }} />
          <input type="text" name="specialization" placeholder="Specialization" value={filters.specialization} onChange={handleFilterChange} style={{ flex: 1, minWidth: '120px' }} />
          <button className="btn btn-primary" onClick={fetchDoctors}>
            <Search size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No doctors found matching your criteria.</div>
      ) : (
        <div className="grid-responsive">
          {doctors.map(doc => (
            <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{doc.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#fef08a', color: '#854d0e', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                  <Star size={14} fill="currentColor" /> {doc.rating || 'N/A'}
                </div>
              </div>
              <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{doc.specialization}</p>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <MapPin size={16} /> {doc.hospital}, {doc.area}, {doc.city}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Experience: {doc.experience}</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>₹{doc.fee}</div>
                </div>
                <Link to={`/book/${doc.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}>
                  Book Slot
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
