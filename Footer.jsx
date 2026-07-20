import React from 'react';
import { Stethoscope, Github, Mail, Heart, Shield, Users, Award } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: '#f8fafc',
      marginTop: '4rem',
      padding: '3rem 2rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Brand */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            <Stethoscope color="#6366f1" />
            <span>TeleMed-AI</span>
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            AI-powered telemedicine platform providing accessible healthcare through 
            intelligent disease prediction and video consultations.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.75rem',
              background: 'rgba(99, 102, 241, 0.2)',
              borderRadius: '999px',
              fontSize: '0.75rem',
              color: '#a5b4fc'
            }}>
              <Shield size={12} /> HIPAA Compliant
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.75rem',
              background: 'rgba(34, 197, 94, 0.2)',
              borderRadius: '999px',
              fontSize: '0.75rem',
              color: '#86efac'
            }}>
              <Award size={12} /> 91% Accuracy
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { label: 'Find Doctors', href: '/doctors' },
              { label: 'Symptom Checker', href: '/symptom-checker' },
              { label: 'Appointments', href: '/appointments' },
              { label: 'My Profile', href: '/profile' }
            ].map(link => (
              <li key={link.href} style={{ marginBottom: '0.5rem' }}>
                <a 
                  href={link.href}
                  style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.color = '#f8fafc'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Platform Stats</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: <Users size={16} />, label: 'Active Doctors', value: '50+' },
              { icon: <Heart size={16} />, label: 'Patients Served', value: '1000+' },
              { icon: <Award size={16} />, label: 'Diseases Detected', value: '41' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <span style={{ color: '#6366f1' }}>{stat.icon}</span>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '700' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>
          © {currentYear} TeleMed-AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
