import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Users, Stethoscope, Calendar, CreditCard, ServerCrash, Plus, Trash2, RefreshCw, UserCircle } from 'lucide-react';

export default function AdminDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [data, setData] = useState({
    users: [],
    doctors: [],
    appointments: [],
    payments: []
  });

  const [docForm, setDocForm] = useState({
    name: '', specialization: '', city: '', area: '', hospital: '', 
    experience: '', fee: '', email: '', password: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [users, doctors, appointments, payments] = await Promise.all([
        apiClient('/admin/users'),
        apiClient('/admin/doctors'),
        apiClient('/admin/appointments'),
        apiClient('/admin/payments')
      ]);

      setData({ users, doctors, appointments, payments });
    } catch (err) {
      console.error(err);
      setError("Failed to load administrative data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.hash === '#profile') setActiveTab('profile');
    else if (activeTab === 'profile') setActiveTab('overview');
  }, [location]);

  const handleDocChange = (e) => setDocForm({ ...docForm, [e.target.name]: e.target.value });

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      await apiClient('/admin/add-doctor', {
        method: 'POST',
        body: JSON.stringify(docForm)
      });
      // Refresh
      fetchData();
      setDocForm({ name: '', specialization: '', city: '', area: '', hospital: '', experience: '', fee: '', email: '', password: '' });
      setActiveTab('doctors');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await apiClient(`/admin/delete-doctor/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert("Error deleting doctor: " + err.message);
    }
  };

  if (loading && data.users.length === 0) {
    return <div className="page-container"><p>Loading system overview...</p></div>;
  }

  if (error && data.users.length === 0) return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <ServerCrash size={48} color="var(--error-color)" style={{ margin: '0 auto 1rem auto' }} />
      <h2 style={{ color: 'var(--error-color)' }}>{error}</h2>
      <p>Ensure you have administrative privileges to view this page.</p>
    </div>
  );

  return (
    <div className="page-container" style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-color)', margin: 0 }}>Admin Portal</h1>
        <button onClick={fetchData} className="btn" style={{ background: 'transparent', color: 'var(--primary-color)' }}>
          <RefreshCw size={20} /> Sync
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--bg-secondary)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {['overview', 'users', 'doctors', 'appointments', 'payments', 'profile'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem', background: 'none', border: 'none',
              borderBottom: activeTab === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer', textTransform: 'capitalize', fontSize: '1rem'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Users size={40} color="var(--primary-color)" />
            <h3>Patients</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{data.users.length}</p>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Stethoscope size={40} color="var(--secondary-color)" />
            <h3>Doctors</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{data.doctors.length}</p>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Calendar size={40} color="var(--success-color)" />
            <h3>Appointments</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{data.appointments.length}</p>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <CreditCard size={40} color="var(--warning-color)" />
            <h3>Payments</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>{data.payments.length}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Registered Patients</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bg-secondary)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                  <td style={{ padding: '1rem' }}>#{u.id}</td>
                  <td style={{ padding: '1rem' }}>{u.name}</td>
                  <td style={{ padding: '1rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>{u.phone || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ overflowX: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Active Doctors</h2>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bg-secondary)' }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Specialty</th>
                  <th style={{ padding: '1rem' }}>Hospital</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.doctors.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                    <td style={{ padding: '1rem' }}>#{d.id}</td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{d.name}</td>
                    <td style={{ padding: '1rem' }}>{d.specialization}</td>
                    <td style={{ padding: '1rem' }}>{d.hospital} ({d.city})</td>
                    <td style={{ padding: '1rem' }}>
                      <button onClick={() => handleDeleteDoctor(d.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card" style={{ background: 'var(--bg-secondary)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus /> Add New Doctor</h3>
            {formError && <p style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{formError}</p>}
            
            <form onSubmit={handleAddDoctor} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <input type="text" name="name" placeholder="Full Name" value={docForm.name} onChange={handleDocChange} required />
              <input type="email" name="email" placeholder="Email Address" value={docForm.email} onChange={handleDocChange} required />
              <input type="password" name="password" placeholder="Password" value={docForm.password} onChange={handleDocChange} required />
              <input type="text" name="specialization" placeholder="Specialization" value={docForm.specialization} onChange={handleDocChange} required />
              <input type="text" name="city" placeholder="City" value={docForm.city} onChange={handleDocChange} required />
              <input type="text" name="area" placeholder="Area" value={docForm.area} onChange={handleDocChange} required />
              <input type="text" name="hospital" placeholder="Hospital/Clinic" value={docForm.hospital} onChange={handleDocChange} required />
              <input type="number" name="experience" placeholder="Years Experience" value={docForm.experience} onChange={handleDocChange} required />
              <input type="number" name="fee" placeholder="Consultation Fee" value={docForm.fee} onChange={handleDocChange} required />
              
              <button type="submit" className="btn btn-primary" disabled={formLoading} style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                {formLoading ? 'Adding...' : 'Create Doctor Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>System Appointments</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bg-secondary)' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Date & Time</th>
                <th style={{ padding: '1rem' }}>Patient</th>
                <th style={{ padding: '1rem' }}>Doctor</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.appointments.map(a => (
                <tr key={a.appointment_id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                  <td style={{ padding: '1rem' }}>#{a.appointment_id}</td>
                  <td style={{ padding: '1rem' }}>{a.date} | {a.time}</td>
                  <td style={{ padding: '1rem' }}>{a.patient_name}</td>
                  <td style={{ padding: '1rem' }}>{a.doctor_name.startsWith('Dr.') ? a.doctor_name : `Dr. ${a.doctor_name}`}</td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize', color: a.status === 'confirmed' ? 'var(--success-color)' : a.status === 'completed' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                    <b>{a.status}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Transaction History</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bg-secondary)' }}>
                <th style={{ padding: '1rem' }}>Pay ID</th>
                <th style={{ padding: '1rem' }}>User ID</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map(p => (
                <tr key={p.payment_id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                  <td style={{ padding: '1rem' }}>#{p.payment_id}</td>
                  <td style={{ padding: '1rem' }}>User {p.user_id}</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>₹{p.amount}</td>
                  <td style={{ padding: '1rem', color: p.status === 'success' ? 'var(--success-color)' : 'var(--error-color)' }}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <UserCircle size={64} color="var(--primary-color)" style={{ margin: '0 auto 1rem auto' }} />
          <h2>Administrator Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You are logged in with elevated system permissions.</p>
        </div>
      )}

    </div>
  );
}
