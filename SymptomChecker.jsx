import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Bot, AlertTriangle, CheckCircle, Activity, Stethoscope } from 'lucide-react';

const getRecommendedSpecialization = (disease) => {
  if (!disease) return 'General Physician';
  const disLower = disease.toLowerCase();
  if (disLower.includes('heart') || disLower.includes('cardiac') || disLower.includes('hypertension')) return 'Cardiologist';
  if (disLower.includes('skin') || disLower.includes('acne') || disLower.includes('psoriasis') || disLower.includes('fungal')) return 'Dermatologist';
  if (disLower.includes('migraine') || disLower.includes('brain') || disLower.includes('stroke') || disLower.includes('paralysis')) return 'Neurologist';
  if (disLower.includes('bone') || disLower.includes('arthritis') || disLower.includes('fracture') || disLower.includes('osteo')) return 'Orthopedist';
  if (disLower.includes('diabetes') || disLower.includes('thyroid')) return 'Endocrinologist';
  if (disLower.includes('asthma') || disLower.includes('breathe') || disLower.includes('lung') || disLower.includes('tuberculosis') || disLower.includes('pneumonia')) return 'Pulmonologist';
  if (disLower.includes('stomach') || disLower.includes('gerd') || disLower.includes('ulcer') || disLower.includes('gastritis') || disLower.includes('peptic')) return 'Gastroenterologist';
  if (disLower.includes('eye')) return 'Ophthalmologist';
  if (disLower.includes('tooth') || disLower.includes('dental')) return 'Dentist';
  if (disLower.includes('allergy')) return 'Allergist';
  return 'General Physician';
};

export default function SymptomChecker() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await apiClient('/predict', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
            <Bot size={32} color="var(--primary-color)" />
          </div>
          <div>
            <h2 style={{ color: 'var(--primary-color)' }}>AI Symptom Checker</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Describe your symptoms, and our ML model will analyze them.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea 
            rows="4" 
            placeholder="e.g. I have been having a severe headache and fever since yesterday..." 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            style={{ resize: 'vertical', fontSize: '1rem' }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !text.trim()}>
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '1.5rem', backgroundColor: 'var(--error-color)', color: 'white', padding: '1rem', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
            <h3 style={{ marginBottom: '1rem' }}>Analysis Results</h3>
            
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px', borderLeft: `4px solid ${result.urgency === 'High' ? 'var(--error-color)' : result.urgency === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)'}` }}>
                {result.urgency === 'High' ? <AlertTriangle color="var(--error-color)" /> : <Activity color="var(--success-color)" />}
                <div>
                  <strong>Urgency: {result.urgency}</strong>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{result.reason}</div>
                </div>
              </div>

              {result.symptoms && result.symptoms.length > 0 && (
                <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                  <strong>Extracted Symptoms:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {Array.isArray(result.symptoms) ? result.symptoms.map((symptom, i) => (
                      <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-color)', color: 'white', borderRadius: '16px', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                        {typeof symptom === 'string' ? symptom.replace(/_/g, ' ') : symptom}
                      </span>
                    )) : (
                      <span style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-color)', color: 'white', borderRadius: '16px', fontSize: '0.875rem' }}>
                        {result.symptoms}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {result.predictions && result.predictions.length > 0 && (
                <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                  <strong>Possible Conditions:</strong>
                  <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result.predictions.map((p, i) => (
                      <li key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong>{p.disease}</strong>
                          <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                            {p.confidence !== undefined ? p.confidence.toFixed(1) : 'N/A'}%
                          </span>
                        </div>
                        {p.description && <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{p.description}</div>}
                        {p.precautions && p.precautions.length > 0 && (
                          <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            <strong>Precautions: </strong> {p.precautions.join(', ')}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <Stethoscope color="var(--primary-color)" size={24} />
                    <div>
                      <strong>Recommended Specialist:</strong>
                      <div style={{ fontSize: '1rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                        {getRecommendedSpecialization(result.predictions[0].disease)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Next step: Get an official diagnosis.</p>
              <a href="/doctors" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Find a Doctor Now
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
