import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useToast } from '../components/Toast';
import { Calendar, Video, Clock, CheckCircle, UserCircle, Edit3, Plus, Trash2, History, X, Users, TrendingUp, Star } from 'lucide-react';

export default function DoctorDashboard() {
  const location = useLocation();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('appointments');
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Patient History Modal State
  const [showHistory, setShowHistory] = useState(false);
  const [patientHistory, setPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '', specialization: '', city: '', area: '', hospital: '', experience: '', fee: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Slots Form State
  const [slotForm, setSlotForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [slotMsg, setSlotMsg] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Fetching doctor dashboard data...');
      const [profileData, aptData, slotsData] = await Promise.all([
        apiClient('/doctor/profile'),
        apiClient('/doctor/appointments'),
        apiClient('/doctor/slots')
      ]);
      console.log('Profile data received:', profileData);
      console.log('Appointments:', aptData);
      console.log('Slots:', slotsData);
      
      setProfile(profileData);

      // Initialize form with backend data
      setProfileForm({
        name: profileData.name || '',
        specialization: profileData.specialization || '',
        city: profileData.city || '',
        area: profileData.area || '',
        hospital: profileData.hospital || '',
        experience: profileData.experience || '',
        fee: profileData.fee || ''
      });

      setAppointments(aptData);
      setSlots(slotsData);
    } catch (err) {
      console.error("Failed to load doctor dashboard:", err);
      toast.addToast("Failed to load dashboard data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (location.hash === '#profile') setActiveTab('profile');
    else setActiveTab('appointments');
  }, [location]);

  const handleMarkComplete = async (id) => {
    try {
      await apiClient(`/doctor/complete/${id}`, { method: 'PUT' });
      const aptData = await apiClient('/doctor/appointments');
      setAppointments(aptData);
      toast.addToast("Appointment marked as completed!", "success");
    } catch (err) {
      toast.addToast("Failed to mark as complete: " + err.message, "error");
    }
  };

  const handleConsultationDone = async (id) => {
    try {
      await apiClient(`/doctor/consultation-done/${id}`, { method: 'PUT' });
      toast.addToast("Consultation marked as done! You can now mark appointment as completed.", "success");
      const aptData = await apiClient('/doctor/appointments');
      setAppointments(aptData);
    } catch (err) {
      toast.addToast("Failed to mark consultation done: " + err.message, "error");
    }
  };

  const handleViewPatientHistory = async (userId) => {
    setShowHistory(true);
    setHistoryLoading(true);
    try {
      const data = await apiClient(`/doctor/patient-history/${userId}`);
      setPatientHistory(data);
    } catch (err) {
      toast.addToast("Failed to fetch patient history: " + err.message, "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleGenerateVideoLink = async (id) => {
    try {
      const response = await apiClient(`/doctor/generate-video/${id}`, { method: 'POST' });
      toast.addToast(`Video link generated successfully!`, "success");
      // Refresh appointments to show updated video link
      const aptData = await apiClient('/doctor/appointments');
      setAppointments(aptData);
    } catch (err) {
      toast.addToast("Failed to generate video link: " + err.message, "error");
    }
  };

  const handleSendEmail = async (id) => {
    try {
      const response = await apiClient(`/doctor/send-email/${id}`, { method: 'POST' });
      toast.addToast("✅ Email sent successfully to patient!", "success");
    } catch (err) {
      toast.addToast("Failed to send email: " + err.message, "error");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMsg('');
    try {
      await apiClient('/doctor/profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      });
      toast.addToast("Profile updated successfully!", "success");
      // Update local header state
      setProfile({ ...profile, ...profileForm });
    } catch (err) {
      toast.addToast(err.message || 'Error updating profile', "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSlotChange = (e) => setSlotForm({ ...slotForm, [e.target.name]: e.target.value });

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setIsAddingSlot(true);
    setSlotMsg('');
    try {
      await apiClient('/doctor/add-slot', {
        method: 'POST',
        body: JSON.stringify(slotForm)
      });
      toast.addToast("Slot added successfully!", "success");
      // Refresh slots
      const slotsData = await apiClient('/doctor/slots');
      setSlots(slotsData);
      // Reset form
      setSlotForm({
        date: new Date().toISOString().split('T')[0],
        time: '09:00'
      });
    } catch (err) {
      toast.addToast(err.message || 'Error adding slot', "error");
    } finally {
      setIsAddingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    try {
      await apiClient(`/doctor/delete-slot/${slotId}`, { method: 'DELETE' });
      toast.addToast("Slot deleted successfully!", "success");
      // Refresh slots
      const slotsData = await apiClient('/doctor/slots');
      setSlots(slotsData);
    } catch (err) {
      toast.addToast('Error deleting slot: ' + err.message, "error");
    }
  };

  if (loading) return <div className="page-container"><div className="skeleton" style={{ height: '120px', marginBottom: '2rem' }}></div><div className="skeleton" style={{ height: '200px' }}></div></div>;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const doctorName = profile?.name?.startsWith('Dr.') ? profile?.name : `Dr. ${profile?.name || 'Doctor'}`;
  const firstName = profile?.name?.replace('Dr. ', '').split(' ')[0] || 'Doctor';
  
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const totalSlots = slots.filter(s => !s.is_booked).length;

  return (
    <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Debug Display - Remove after fixing */}
      {process.env.NODE_ENV === 'development' && profile && (
        <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <strong>🔍 Debug Profile Data:</strong>
          <pre style={{ marginTop: '0.5rem', overflow: 'auto' }}>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
      {process.env.NODE_ENV === 'development' && !profile && (
        <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <strong>❌ Profile is NULL - Data not loaded!</strong>
        </div>
      )}

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        border: 'none'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            {getGreeting()} 👋
          </p>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <UserCircle size={28} /> {doctorName}
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.875rem' }}>
            {profile?.specialization} | {profile?.hospital} ({profile?.city})
          </p>
        </div>
        <Star size={100} style={{ position: 'absolute', right: '-15px', top: '-15px', opacity: 0.1 }} />
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
            <Calendar size={20} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{confirmedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Upcoming</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px' }}>
            <CheckCircle size={20} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{completedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completed</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '12px' }}>
            <Clock size={20} color="#0ea5e9" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{totalSlots}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Open Slots</div>
          </div>
        </div>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
            <Star size={20} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{profile?.rating || 'N/A'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rating</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--bg-secondary)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            padding: '0.5rem 1rem', background: 'none', border: 'none',
            borderBottom: activeTab === 'appointments' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'appointments' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'appointments' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem',
            whiteSpace: 'nowrap'
          }}
        >
          My Appointments
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          style={{
            padding: '0.5rem 1rem', background: 'none', border: 'none',
            borderBottom: activeTab === 'slots' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'slots' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'slots' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem',
            whiteSpace: 'nowrap'
          }}
        >
          Manage Slots
        </button>
        <button
          onClick={() => { 
            console.log('=== DEBUG: Profile State ===');
            console.log('profile:', profile);
            console.log('profileForm:', profileForm);
            setActiveTab('profile');
          }}
          style={{
            padding: '0.5rem 1rem', background: 'none', border: 'none',
            borderBottom: activeTab === 'profile' ? '3px solid var(--primary-color)' : '3px solid transparent',
            color: activeTab === 'profile' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'profile' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '1.1rem',
            whiteSpace: 'nowrap'
          }}
        >
          Edit Profile
        </button>
      </div>

      {activeTab === 'appointments' && (
        <>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar /> Assigned Encounters
          </h2>

          {appointments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
               <Clock size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
               <p style={{ color: 'var(--text-secondary)' }}>You have no scheduled appointments.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appointments.map((apt) => (
                <div key={apt.appointment_id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.25rem', fontSize: '1.2rem', wordBreak: 'break-word' }}>Patient: {apt.patient_name}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem', wordBreak: 'break-word' }}>
                      Email: {apt.patient_email} | Phone: {apt.phone}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        {apt.date} at {apt.time}
                      </span>
                      <span className={`badge badge-${apt.status}`}>
                        {apt.status === 'confirmed' && <CheckCircle size={12} />}
                        {apt.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Generate Video Link Button - Always show if no video link */}
                    {!apt.video_link && apt.status !== 'completed' && (
                      <button
                        onClick={() => handleGenerateVideoLink(apt.appointment_id)}
                        className="btn"
                        style={{ background: '#8b5cf6', color: 'white', border: 'none' }}
                      >
                        <Video size={18} /> Generate Video Link
                      </button>
                    )}
                    
                    {/* Join Meeting Button - Show if video link exists */}
                    {apt.video_link && apt.status === 'confirmed' && (
                      <a href={apt.video_link} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                        <Video size={18} /> Join Meeting
                      </a>
                    )}
                    
                    {/* Send Email Button - Show for confirmed appointments */}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleSendEmail(apt.appointment_id)}
                        className="btn"
                        style={{ background: '#10b981', color: 'white', border: 'none' }}
                      >
                        📧 Send Email
                      </button>
                    )}
                    
                    {/* Mark Complete Button */}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleMarkComplete(apt.appointment_id)}
                        className="btn"
                        style={{ background: 'var(--success-color)', color: 'white', border: 'none' }}
                      >
                        <CheckCircle size={18} /> Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'slots' && (
        <>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar /> Manage Availability Slots
          </h2>

          {/* Add Slot Form */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} /> Add New Slot
            </h3>
            {slotMsg && (
              <div style={{ padding: '1rem', background: slotMsg.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'var(--error-color)', color: slotMsg.includes('success') ? 'var(--success-color)' : 'white', borderRadius: '8px', marginBottom: '1rem' }}>
                {slotMsg}
              </div>
            )}
            <form onSubmit={handleAddSlot} style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={slotForm.date} 
                  onChange={handleSlotChange} 
                  min={new Date().toISOString().split('T')[0]}
                  required 
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Time</label>
                <input 
                  type="time" 
                  name="time" 
                  value={slotForm.time} 
                  onChange={handleSlotChange} 
                  required 
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isAddingSlot} style={{ height: 'fit-content' }}>
                {isAddingSlot ? 'Adding...' : 'Add Slot'}
              </button>
            </form>
          </div>

          {/* Slots List */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Your Available Slots</h3>
            {slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <Clock size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <p>No slots available. Add some slots above to start accepting appointments.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {slots.map((slot) => (
                  <div key={slot.id} className="card" style={{ 
                    border: slot.is_booked ? '2px solid var(--error-color)' : '1px solid var(--border-color)',
                    background: slot.is_booked ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-primary)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                          {new Date(slot.date).toLocaleDateString()}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          {slot.time}
                        </div>
                        <div style={{ 
                          marginTop: '0.5rem',
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px',
                          background: slot.is_booked ? 'var(--error-color)' : 'var(--success-color)',
                          color: 'white',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          display: 'inline-block'
                        }}>
                          {slot.is_booked ? 'Booked' : 'Available'}
                        </div>
                      </div>
                      {!slot.is_booked && (
                        <button 
                          onClick={() => handleDeleteSlot(slot.id)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--error-color)', 
                            cursor: 'pointer',
                            padding: '0.25rem'
                          }}
                          title="Delete slot"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'profile' && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
            <Edit3 /> Maintain Profile Information
          </h2>
          {updateMsg && (
            <div style={{ padding: '1rem', background: updateMsg.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'var(--error-color)', color: updateMsg.includes('success') ? 'var(--success-color)' : 'white', borderRadius: '8px', marginBottom: '1.5rem' }}>
              {updateMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Specialization</label>
              <input type="text" name="specialization" value={profileForm.specialization} onChange={handleProfileChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hospital/Clinic Designation</label>
              <input type="text" name="hospital" value={profileForm.hospital} onChange={handleProfileChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>City / Region</label>
              <input type="text" name="city" value={profileForm.city} onChange={handleProfileChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Operating Area</label>
              <input type="text" name="area" value={profileForm.area} onChange={handleProfileChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Years of Experience</label>
              <input type="number" name="experience" value={profileForm.experience} onChange={handleProfileChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Consultation Fee ($)</label>
              <input type="number" name="fee" value={profileForm.fee} onChange={handleProfileChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', textAlign: 'right' }}>
              <button type="submit" className="btn btn-primary" disabled={isUpdating} style={{ width: 'auto', padding: '1rem 2rem' }}>
                {isUpdating ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
