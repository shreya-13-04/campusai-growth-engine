import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  CheckCircle2,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';
import { MetricCard } from '../MetricCard';

export const RegistrationsTab = () => {
  const {
    registrations,
    channels,
    addRegistration,
    totalRegistrations,
    activeReferralCode,
    showToast,
  } = useGrowthData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');

  // Form states for inline registration intake
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [channelId, setChannelId] = useState('whatsapp-groups');
  const [referralCode, setReferralCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeReferralCode) {
      setReferralCode(activeReferralCode);
      setChannelId('ambassadors');
    }
  }, [activeReferralCode]);

  const handleRegisterStudent = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !college.trim()) {
      setErrorMessage('Please fill out all required fields.');
      showToast('Please fill out student name, email, and college.', 'info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = addRegistration({
        name: name.trim(),
        email: email.trim(),
        college: college.trim(),
        channelId,
        referralCode: referralCode.trim() || undefined,
      });

      setIsSubmitting(false);

      if (res && !res.success) {
        setErrorMessage(res.message || 'Registration failed: duplicate email detected.');
        return;
      }

      setName('');
      setEmail('');
      setCollege('');
      setReferralCode(activeReferralCode || '');
      setErrorMessage('');
    }, 150);
  };

  // RFC 4180 CSV Export with strict escaping for quotes, commas, and newlines
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleExportCSV = () => {
    const headers = [
      'Registration ID',
      'Student Name',
      'College Email',
      'Institution',
      'Acquisition Channel',
      'Attributed Referral Code',
      'Timestamp',
      'Verification Status',
    ].map(escapeCSV).join(',') + '\n';

    const rows = registrations
      .map((r) => [
        r.id,
        r.name,
        r.email,
        r.college,
        r.channel,
        r.referralCode || (r.channel.includes('Ambassador') ? r.channel.replace('Ambassador (', '').replace(')', '') : 'DIRECT'),
        r.time || r.timestamp || 'N/A',
        r.verified ? 'Verified Active Pass' : 'Pending Verification',
      ].map(escapeCSV).join(','))
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campusai_growth_registrations_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Exported registrations list as compliant CSV!');
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.referralCode && reg.referralCode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesChannel =
      selectedChannel === 'all' || reg.channel.toLowerCase().includes(selectedChannel.toLowerCase());

    return matchesSearch && matchesChannel;
  });

  return (
    <div className="view-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2>Student Registrations Intake & Audit Log</h2>
          <p className="section-desc">
            Directly test the registration funnel. Every student registered updates total registrations, daily velocity, and referral leaderboards in real time.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            Export Compliant CSV
          </button>
        </div>
      </div>

      {/* Top Registration Intake Form & Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Quick Intake Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} style={{ color: 'var(--primary-light)' }} />
                Simulate Student Registration
              </h3>
              <p className="card-subtitle">
                Test the growth pipeline and see dashboard counters react immediately
              </p>
            </div>
          </div>

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
              🔗 Incoming Referral Tag Active: <strong>{activeReferralCode}</strong>
            </div>
          )}

          <form onSubmit={handleRegisterStudent}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">Full Name *</label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Tanvi Agarwal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">College Email *</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="e.g. tanvi.a@vbit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-college" className="form-label">College / University Name *</label>
              <input
                id="reg-college"
                type="text"
                required
                className="form-input"
                placeholder="e.g. Vignana Bharathi Institute of Technology (VBIT)"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label htmlFor="reg-channel" className="form-label">Acquisition Channel</label>
                <select
                  id="reg-channel"
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
                <label htmlFor="reg-ref" className="form-label">Referral Tag (Optional)</label>
                <input
                  id="reg-ref"
                  type="text"
                  className="form-input"
                  placeholder="e.g. AI-ADITYA or AI-SNEHA"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <UserPlus size={16} />
              {isSubmitting ? 'Validating...' : 'Register Student & Trigger Growth Loops'}
            </button>
          </form>
        </div>

        {/* Live Registration Verification Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MetricCard
            label="Total Logged Registrations"
            value={totalRegistrations}
            subtext="Confirmed students in simulation database"
            icon={Users}
            badgeText="Live Sync"
            badgeType="positive"
            accentColor="#6D5CE8"
          />

          <div
            className="card"
            style={{
              flex: 1,
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, #FFFFFF 100%)',
              border: '1px solid rgba(16,185,129,0.25)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-highlight)' }}>
                Duplicate Prevention & Audit Protection
              </strong>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Every registration is verified against existing email entries to prevent double-counting. Ambassador tags instantly credit the referring student on the leaderboard and recalculate the campaign run-rate.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search by student name, college, email, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} style={{ color: 'var(--text-dim)' }} />
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
            >
              <option value="all">All Channels</option>
              <option value="Ambassador">Ambassadors</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Tech Clubs">Tech Clubs</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Campus Posters">Posters/QR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Data Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3>Registered Student Roster</h3>
            <p className="card-subtitle">
              Showing {filteredRegistrations.length} of {registrations.length} total demo registrations
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Institution</th>
                <th>Attributed Source</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--primary-tint)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                        }}
                      >
                        {reg.name.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-highlight)' }}>{reg.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{reg.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{reg.college}</td>
                  <td>
                    <span className="badge badge-indigo" style={{ fontSize: '0.74rem' }}>
                      {reg.channel}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{reg.time}</td>
                  <td>
                    <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Confirmed Pass
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
