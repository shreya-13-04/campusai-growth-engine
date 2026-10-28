import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';

export const QuickRegModal = () => {
  const {
    isQuickRegOpen,
    setIsQuickRegOpen,
    channels,
    addRegistration,
    activeReferralCode,
    showToast,
  } = useGrowthData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [channelId, setChannelId] = useState('whatsapp-groups');
  const [referralCode, setReferralCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill active referral code if user came via a referral link
  useEffect(() => {
    if (activeReferralCode) {
      setReferralCode(activeReferralCode);
      setChannelId('ambassadors');
    }
  }, [activeReferralCode, isQuickRegOpen]);

  if (!isQuickRegOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !college.trim()) {
      setErrorMessage('Please fill out all required fields.');
      showToast('Please fill out student name, email, and college.', 'info');
      return;
    }

    const res = addRegistration({
      name: name.trim(),
      email: email.trim(),
      college: college.trim(),
      channelId,
      referralCode: referralCode.trim() || undefined,
    });

    if (res && !res.success) {
      setErrorMessage(res.message || 'Registration failed (duplicate email detected).');
      return;
    }

    setName('');
    setEmail('');
    setCollege('');
    setReferralCode(activeReferralCode || '');
    setErrorMessage('');
    setIsQuickRegOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsQuickRegOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary-tint)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="modal-title">Simulate Live Registration</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Test immediate counter & leaderboard propagation
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setIsQuickRegOpen(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMessage && (
              <div
                style={{
                  background: 'var(--accent-rose-tint)',
                  border: '1px solid var(--accent-rose)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--accent-rose)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  fontWeight: '600',
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {activeReferralCode && (
              <div
                style={{
                  background: 'var(--accent-cyan-tint)',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  color: 'var(--accent-cyan)',
                  marginBottom: '16px',
                  fontWeight: '600',
                }}
              >
                🔗 Attributing to incoming referral code: <strong>{activeReferralCode}</strong>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="quick-name" className="form-label">Student Name *</label>
              <input
                id="quick-name"
                type="text"
                required
                className="form-input"
                placeholder="e.g. Varun Teja"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quick-email" className="form-label">Student Email *</label>
              <input
                id="quick-email"
                type="email"
                required
                className="form-input"
                placeholder="e.g. varun.t@cbit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="form-hint">Duplicate emails are prevented to maintain metrics integrity</div>
            </div>

            <div className="form-group">
              <label htmlFor="quick-college" className="form-label">College / Institute *</label>
              <input
                id="quick-college"
                type="text"
                required
                className="form-input"
                placeholder="e.g. Chaitanya Bharathi Institute of Technology"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label htmlFor="quick-channel" className="form-label">Source Channel</label>
                <select
                  id="quick-channel"
                  className="form-select"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                >
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="quick-ref" className="form-label">Referral Code (Optional)</label>
                <input
                  id="quick-ref"
                  type="text"
                  className="form-input"
                  placeholder="e.g. AI-ADITYA"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsQuickRegOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Sparkles size={16} />
              Submit Test Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
