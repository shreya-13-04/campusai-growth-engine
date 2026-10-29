import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  CheckCircle2,
  Download,
  AlertCircle,
  X,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';

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
      showToast('Please fill out student name, email, and college.', 'warning');
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
    }, 120);
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
      {/* Executive Key Figures Strip */}
      <div className="executive-kpi-bar">
        <div className="kpi-cell">
          <div className="kpi-cell-label">Total Verified Registrations</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{totalRegistrations}</span>
            <span className="kpi-sub">/ 500</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-indigo">Database Sync</span>
            <span className="kpi-caption">Real-time counter</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Ambassador Attributed</div>
          <div className="kpi-cell-val">
            <span className="mono-num">
              {registrations.filter((r) => r.channel.toLowerCase().includes('ambassador')).length}
            </span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-green">P2P Referrals</span>
            <span className="kpi-caption">Credited to leads</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Duplicate Audit Guard</div>
          <div className="kpi-cell-val" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
            Active
          </div>
          <div className="kpi-meta">
            <span className="badge badge-cyan">Zero Double-Count</span>
            <span className="kpi-caption">Email deduplication</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Export Format</div>
          <div className="kpi-cell-val" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
            RFC 4180
          </div>
          <div className="kpi-meta">
            <span className="badge badge-purple">Compliant</span>
            <span className="kpi-caption">Strict CSV escaping</span>
          </div>
        </div>
      </div>

      {/* Top Registration Intake Form & Duplicate Guard Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Quick Intake Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Simulate Student Registration</h3>
              <p className="card-subtitle">
                Test the growth pipeline and see counters and leaderboards update immediately
              </p>
            </div>
          </div>

          {errorMessage && (
            <div
              className="alert alert-error"
              style={{
                background: 'var(--accent-rose-tint)',
                border: '1px solid var(--accent-rose-border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: 'var(--accent-rose-text)',
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
                border: '1px solid var(--accent-cyan-border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: '0.78rem',
                color: 'var(--accent-cyan-text)',
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
              {isSubmitting ? 'Validating...' : 'Submit Student Registration'}
            </button>
          </form>
        </div>

        {/* Verification and Audit Information Card */}
        <div
          className="card"
          style={{
            marginBottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, #FFFFFF 100%)',
            border: '1px solid rgba(16,185,129,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--accent-emerald-tint)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-highlight)' }}>
                Audited Growth Pipeline
              </strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Deduplication & real-time metric propagation
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
            <p>
              • <strong>Duplicate Prevention:</strong> Every submission checks existing records. Entering an existing email triggers an inline validation alert.
            </p>
            <p>
              • <strong>Multi-Table Sync:</strong> Submitting a registration updates the campaign total, acquisition channel count, daily run-rate velocity, and the referring ambassador's leaderboard tally simultaneously.
            </p>
            <p>
              • <strong>Data Export:</strong> Use the button below to export the entire student roster as an RFC 4180 compliant CSV file for audit and verification.
            </p>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleExportCSV}
            >
              <Download size={14} />
              Export Student Roster (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by student name, college, email, or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
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
              <option value="Campus Posters">Posters / QR</option>
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
              Showing {filteredRegistrations.length} of {registrations.length} total verified demo registrations
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {filteredRegistrations.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
              No student registrations found matching "{searchTerm}".
            </p>
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearchTerm(''); setSelectedChannel('all'); }}>
              Clear Search &amp; Filters
            </button>
          </div>
        ) : (
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
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{reg.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{reg.college}</td>
                    <td>
                      <span className="badge badge-indigo" style={{ fontSize: '0.74rem' }}>
                        {reg.channel}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{reg.time}</td>
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
        )}
      </div>
    </div>
  );
};
