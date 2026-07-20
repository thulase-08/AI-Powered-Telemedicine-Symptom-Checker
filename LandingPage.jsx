import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, Shield, Users, Video, Calendar, Brain, 
  ChevronRight, ArrowRight, Star, CheckCircle, 
  Stethoscope, Heart, Clock, Award, Play
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #0ea5e9 100%)',
        padding: '6rem 2rem 8rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}></div>
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '4rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '300px', color: 'white' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '999px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <Brain size={16} />
              AI-Powered Healthcare
            </div>
            
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '1.5rem'
            }}>
              Your Health,
              <br />
              <span style={{
                background: 'linear-gradient(to right, #fef08a, #fde047)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Reimagined
              </span>
            </h1>
            
            <p style={{
              fontSize: '1.25rem',
              opacity: 0.9,
              marginBottom: '2rem',
              lineHeight: '1.6',
              maxWidth: '500px'
            }}>
              Experience the future of healthcare with AI-powered symptom analysis, 
              instant doctor consultations, and personalized care—all from the comfort of your home.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/auth')}
                style={{
                  padding: '1rem 2rem',
                  background: 'white',
                  color: '#6366f1',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)';
                }}
              >
                Get Started Free <ArrowRight size={20} />
              </button>
              
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                <Play size={20} /> Learn More
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>91%</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>AI Accuracy</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>1000+</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Patients Served</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800' }}>50+</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Expert Doctors</div>
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '500px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Stethoscope size={24} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.125rem' }}>AI Symptom Analysis</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Instant Results</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Fever & Chills', 'Headache', 'Body Ache'].map((symptom, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}>
                    <CheckCircle size={16} color="#22c55e" />
                    <span style={{ fontSize: '0.875rem' }}>{symptom}</span>
                  </div>
                ))}
              </div>
              
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Prediction: Malaria</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Confidence: 83%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 2rem', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Why Choose TeleMed-AI?
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Advanced AI technology combined with expert medical professionals to deliver 
              the best healthcare experience.
            </p>
          </div>
          
          <div className="grid-responsive">
            {[
              {
                icon: <Brain size={32} />,
                title: 'AI-Powered Diagnosis',
                desc: 'Our advanced ML algorithms analyze symptoms with 91% accuracy to provide instant health insights.',
                color: '#6366f1'
              },
              {
                icon: <Video size={32} />,
                title: 'Video Consultations',
                desc: 'Connect with verified doctors through secure HD video calls from anywhere, anytime.',
                color: '#0ea5e9'
              },
              {
                icon: <Shield size={32} />,
                title: 'Secure & Private',
                desc: 'Your medical data is encrypted and protected. We prioritize your privacy and security.',
                color: '#22c55e'
              },
              {
                icon: <Calendar size={32} />,
                title: 'Easy Scheduling',
                desc: 'Book appointments 24/7 with flexible time slots that fit your busy lifestyle.',
                color: '#f59e0b'
              },
              {
                icon: <Heart size={32} />,
                title: 'Personalized Care',
                desc: 'Receive tailored recommendations based on your medical history and current symptoms.',
                color: '#ef4444'
              },
              {
                icon: <Clock size={32} />,
                title: '24/7 Availability',
                desc: 'Access healthcare services round the clock. No more waiting in long queues.',
                color: '#8b5cf6'
              }
            ].map((feature, idx) => (
              <div key={idx} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: `${feature.color}15`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: feature.color
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '6rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
              Get started in three simple steps
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { step: '1', title: 'Describe Symptoms', desc: 'Use our AI checker to input your symptoms and get instant predictions.', icon: <Activity /> },
              { step: '2', title: 'Book a Doctor', desc: 'Browse verified specialists and schedule a video consultation.', icon: <Users /> },
              { step: '3', title: 'Get Treatment', desc: 'Join your video call and receive personalized medical advice.', icon: <CheckCircle /> }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.5rem',
                padding: '2rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: '800'
                }}>
                  {item.step}
                </div>
                <div style={{ color: '#6366f1' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>{item.desc}</p>
                {idx < 2 && (
                  <div style={{ display: 'none' }}>
                    <ChevronRight size={24} color="var(--text-secondary)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>
            Ready to Experience Better Healthcare?
          </h2>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem' }}>
            Join thousands of patients who trust TeleMed-AI for their healthcare needs.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            style={{
              padding: '1rem 3rem',
              background: 'white',
              color: '#6366f1',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1.125rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)';
            }}
          >
            Start Your Journey <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
