import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Calendar as CalendarIcon, Clock, CreditCard, CheckCircle } from 'lucide-react';

export default function Booking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [step, setStep] = useState(1); // 1: slots, 2: fake payment, 3: success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [paymentId, setPaymentId] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await apiClient('/slots', {
          method: 'POST',
          body: JSON.stringify({ doctor_id: doctorId, date })
        });
        setSlots(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSlots();
    setSelectedSlot(null);
  }, [doctorId, date]);

  const handleProceedToPayment = () => {
    if (!selectedSlot) return;
    setStep(2);
  };

  const handleFakePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Process "Mock" Payment (using generic amount 500)
      const payRes = await apiClient('/payment', {
        method: 'POST',
        body: JSON.stringify({ amount: 500 }) // Assuming fee is 500 for mock
      });
      
      const pid = payRes.payment_id;
      setPaymentId(pid);

      // 2. Book formatting
      const bookRes = await apiClient('/book', {
        method: 'POST',
        body: JSON.stringify({
          slot_id: selectedSlot,
          date: date,
          payment_id: pid
        })
      });

      setAppointmentData({
        id: bookRes.appointment_id,
        link: bookRes.video_link
      });
      
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {step === 1 && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon color="var(--primary-color)" /> Select Appointment
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Choose Date</label>
            <input 
              type="date" 
              value={date} 
              min={new Date().toISOString().split('T')[0]} // prevent past dates
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Available Slots</label>
            {slots.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                No slots available on this date.
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {slots.map(s => (
                  <button
                    key={s.slot_id}
                    onClick={() => setSelectedSlot(s.slot_id)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: `1px solid ${selectedSlot === s.slot_id ? 'var(--primary-color)' : '#cbd5e1'}`,
                      background: selectedSlot === s.slot_id ? 'var(--primary-color)' : 'white',
                      color: selectedSlot === s.slot_id ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Clock size={16} /> {s.time}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }} 
            disabled={!selectedSlot} 
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard color="var(--primary-color)" /> Payment Details
          </h2>
          {error && <div style={{ color: 'white', background: 'var(--error-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
          
          <form onSubmit={handleFakePayment}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Mock Credit Card</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Card Number (e.g. 1234 5678 9101 1121)" required />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="MM/YY" required />
                  <input type="text" placeholder="CVC" required />
                </div>
                <input type="text" placeholder="Cardholder Name" required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn" style={{ flex: 1, background: '#e2e8f0' }} onClick={() => setStep(1)} disabled={loading}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Processing...' : 'Pay & Book'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && appointmentData && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <CheckCircle size={64} color="var(--success-color)" />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your appointment has been successfully scheduled. An email confirmation has been sent.
          </p>
          
          <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'left' }}>
            <p><strong>Appointment ID:</strong> #{appointmentData.id}</p>
            <p><strong>Video Link:</strong> <a href={appointmentData.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>Join Meeting</a></p>
          </div>

          <button onClick={() => navigate('/appointments')} className="btn btn-primary">
            View My Appointments
          </button>
        </div>
      )}

    </div>
  );
}
