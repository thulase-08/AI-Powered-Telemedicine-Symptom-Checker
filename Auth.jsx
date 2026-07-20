import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setAuthRole, apiClient } from '../api/client';
import { Stethoscope, Mail, Lock, User, Phone, ArrowRight, Shield, Activity, Users } from 'lucide-react';

export default function Auth() {
  const [role, setRole] = useState('patient');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
    if (newRole !== 'patient') {
      setIsLogin(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint;
      if (role === 'patient') {
        endpoint = isLogin ? '/login' : '/register';
      } else if (role === 'doctor') {
        endpoint = '/doctor/login';
      } else if (role === 'admin') {
        endpoint = '/admin/login';
      }

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await apiClient(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (isLogin) {
        setAuthToken(response.token);
        setAuthRole(role);
        if (response.name) {
          localStorage.setItem('userName', response.name);
        }
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'doctor') navigate('/doctor-dashboard');
        else navigate('/dashboard');
      } else {
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-primary)'
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #0ea5e9 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <Stethoscope size={28} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>TeleMed-AI</h1>
          </div>
          
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            Your Health,
            <br />
            <span style={{
              background: 'linear-gradient(to right, #fef08a, #fde047)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Our Priority
            </span>
          </h2>
          
          <p style={{ fontSize: '1.125rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '3rem', maxWidth: '400px' }}>
            Join thousands of patients experiencing better healthcare through AI-powered diagnostics and video consultations.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: <Activity size={20} />, title: 'AI Symptom Analysis', desc: '91% accurate predictions' },
              { icon: <Users size={20} />, title: 'Expert Doctors', desc: '50+ verified specialists' },
              { icon: <Shield size={20} />, title: 'Secure & Private', desc: 'HIPAA compliant platform' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        maxWidth: '600px'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          {/* Role Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            background: '#f1f5f9',
            padding: '0.5rem',
            borderRadius: '12px'
          }}>
            {['patient', 'doctor', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: role === r ? 'white' : 'transparent',
                  color: role === r ? '#6366f1' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: role === r ? '700' : '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize',
                  boxShadow: role === r ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {isLogin 
              ? 'Enter your credentials to access your account'
              : 'Fill in your details to get started'
            }
          </p>

          {error && (
            <div style={{
              backgroundColor: error.includes('success') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: error.includes('success') ? '#166534' : '#991b1b',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              border: `1px solid ${error.includes('success') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && role === 'patient' && (
              <>
                <div style={{ position: 'relative' }}>
                  <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <Phone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ paddingLeft: '3rem' }}
                  />
                </div>
              </>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ paddingLeft: '3rem' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingLeft: '3rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {role === 'patient' && (
            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {isLogin ? 'Sign up for free' : 'Log in'}
              </button>
            </p>
          )}

          {role !== 'patient' && (
            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Registration is restricted. Contact system administrator.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
