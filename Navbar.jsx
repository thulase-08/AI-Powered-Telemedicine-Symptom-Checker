import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeAuthToken, getAuthToken, removeAuthRole, getAuthRole } from '../api/client';
import { Stethoscope, LogOut, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = getAuthToken();
  const role = getAuthRole();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    removeAuthRole();
    setMenuOpen(false);
    navigate('/auth');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }} onClick={closeMenu}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope color="var(--primary-color)" />
            TeleMed-AI
          </div>
        </Link>
        
        <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {token ? (
            <>
              {role === 'admin' && (
                <>
                  <Link to="/admin-dashboard" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Admin Dashboard</Link>
                  <Link to="/admin-dashboard#profile" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Profile</Link>
                </>
              )}

              {role === 'doctor' && (
                <>
                  <Link to="/doctor-dashboard" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Doctor Portal</Link>
                  <Link to="/doctor-dashboard#profile" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Profile</Link>
                </>
              )}

              {(!role || role === 'patient') && (
                <>
                  <Link to="/profile" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Profile</Link>
                  <Link to="/appointments" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Appointments</Link>
                  <Link to="/doctors" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>Doctors</Link>
                  <Link to="/symptom-checker" onClick={closeMenu} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>AI Check</Link>
                </>
              )}

              <button onClick={handleLogout} className="btn" style={{ background: 'transparent', padding: '0.5rem' }}>
                <LogOut size={20} color="var(--error-color)" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ textDecoration: 'none' }} onClick={closeMenu}>
              <User size={18} />
              Login / Register
            </Link>
          )}
        </div>
      </nav>
      
      {menuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </>
  );
}
