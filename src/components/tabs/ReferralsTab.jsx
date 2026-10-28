import React, { useState } from 'react';
import {
  Link2,
  QrCode,
  Copy,
  Check,
  Sparkles,
  MousePointerClick,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';
import { MetricCard } from '../MetricCard';

export const ReferralsTab = () => {
  const {
    referralCodes,
    addReferralCode,
    showToast,
  } = useGrowthData();

  const [ownerName, setOwnerName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleGenerateCode = (e) => {
    e.preventDefault();
    if (!ownerName.trim()) {
      showToast('Please provide an Owner or Campus Lead Name.', 'info');
      return;
    }

    const createdCode = addReferralCode({
      ownerName: ownerName.trim(),
      college: collegeName.trim() || 'Tech Campus',
      customCode: customSuffix.trim() || undefined,
      isAmbassador: false,
    });

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusai.nxtwave.io';
    setGeneratedResult({
      code: createdCode,
      url: `${origin}/?ref=${createdCode}`,
      owner: ownerName.trim(),
      college: collegeName.trim() || 'Tech Campus',
    });

    setOwnerName('');
    setCollegeName('');
    setCustomSuffix('');
  };

  const handleCopy = async (text, key) => {
    await copyTextToClipboard(text);
    setCopiedKey(key);
    showToast(`📋 Copied: ${text}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const totalReferralSignups = referralCodes.reduce((sum, rc) => sum + rc.signups, 0);
  const totalReferralClicks = referralCodes.reduce((sum, rc) => sum + rc.clicks, 0);

  return (
    <div className="view-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2>Referral Engine & Tracking Hub</h2>
          <p className="section-desc">
            Generate custom trackable referral links and QR codes for student promoters, college clubs, and campus tech influencers.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="kpi-grid">
        <MetricCard
          label="Active Referral Tags"
          value={referralCodes.length}
          subtext="Codes actively circulating"
          icon={Link2}
          badgeText="Tracked"
          badgeType="positive"
          accentColor="#6D5CE8"
        />

        <MetricCard
          label="Referral Clicks"
          value={totalReferralClicks}
          subtext="Inbound link clicks"
          icon={MousePointerClick}
          badgeText="Landing Views"
          badgeType="neutral"
          accentColor="#0284C7"
        />

        <MetricCard
          label="Referral Signups"
          value={totalReferralSignups}
          subtext="Attributed student registrations"
          icon={TrendingUp}
          badgeText={`${((totalReferralSignups / Math.max(1, totalReferralClicks)) * 100).toFixed(1)}% Conversion`}
          badgeType="positive"
          accentColor="#10B981"
        />
      </div>

      {/* Top Generator Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Code Generator Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--primary-light)' }} />
                Instant Referral Code Generator
              </h3>
              <p className="card-subtitle">
                Issue a branded trackable code with 1-click shareable URL
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateCode}>
            <div className="form-group">
              <label className="form-label">Promoter / Club / Lead Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. ACM Student Chapter or Priya Nair"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / Community</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. IIT Madras, BITS Pilani, or Discord Tech Hub"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Custom Code Suffix (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AI-ACM50 (Default: AI-{NAME})"
                value={customSuffix}
                onChange={(e) => setCustomSuffix(e.target.value.toUpperCase())}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Link2 size={16} />
              Generate Trackable Link & QR
            </button>
          </form>
        </div>

        {/* Generated Result & QR Code Preview */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Generated Link & QR Asset</h3>
              <p className="card-subtitle">Ready for WhatsApp, posters, and campus group forwards</p>
            </div>
          </div>

          {generatedResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              {/* Branded QR Box */}
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '18px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {/* Clean SVG Mock QR Pattern */}
                <svg width="120" height="120" viewBox="0 0 100 100" fill="#252331">
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#6D5CE8" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="#6D5CE8" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#6D5CE8" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="#6D5CE8" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#6D5CE8" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="#FFFFFF" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="#6D5CE8" />

                  {/* Matrix dots */}
                  <rect x="38" y="10" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="50" y="10" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="38" y="22" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="50" y="22" width="8" height="8" rx="1" fill="#0f1629" />

                  <rect x="10" y="38" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="22" y="38" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="10" y="50" width="8" height="8" rx="1" fill="#0f1629" />

                  <rect x="38" y="38" width="24" height="24" rx="3" fill="#6366f1" />
                  <rect x="42" y="42" width="16" height="16" rx="2" fill="#ffffff" />
                  <circle cx="50" cy="50" r="4" fill="#06b6d4" />

                  <rect x="68" y="38" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="80" y="38" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="68" y="50" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="80" y="50" width="8" height="8" rx="1" fill="#0f1629" />

                  <rect x="38" y="68" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="50" y="68" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="38" y="80" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="50" y="80" width="8" height="8" rx="1" fill="#0f1629" />

                  <rect x="68" y="68" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="80" y="68" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="68" y="80" width="8" height="8" rx="1" fill="#0f1629" />
                  <rect x="80" y="80" width="8" height="8" rx="1" fill="#0f1629" />
                </svg>
                <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#0f1629', letterSpacing: '0.04em' }}>
                  {generatedResult.code}
                </span>
              </div>

              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-highlight)' }}>
                  {generatedResult.owner} ({generatedResult.college})
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '4px 0 12px', wordBreak: 'break-all' }}>
                  <code>{generatedResult.url}</code>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCopy(generatedResult.url, 'gen-url')}
                  >
                    {copiedKey === 'gen-url' ? <Check size={14} style={{ color: '#34d399' }} /> : <Copy size={14} />}
                    {copiedKey === 'gen-url' ? 'Copied' : 'Copy Campaign Link'}
                  </button>
                  <button
                    className="btn btn-outline-cyan btn-sm"
                    onClick={() => handleCopy(generatedResult.code, 'gen-code')}
                  >
                    {copiedKey === 'gen-code' ? <Check size={14} style={{ color: '#34d399' }} /> : <Copy size={14} />}
                    {copiedKey === 'gen-code' ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <QrCode size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '0.86rem' }}>
                Fill in promoter or club details on the left to generate an active code and printable QR stamp.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Referral Codes Performance Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3>Active Campaign Referral Codes</h3>
            <p className="card-subtitle">Tracking clicks, signups, and conversion efficiencies</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Referral Code</th>
                <th>Assigned Promoter / Campus</th>
                <th>Tracked Clicks</th>
                <th>Signups</th>
                <th>Conversion Rate</th>
                <th>Date Added</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {referralCodes.map((rc) => {
                const isCopied = copiedKey === rc.code;
                return (
                  <tr key={rc.code}>
                    <td>
                      <code style={{ background: 'var(--primary-tint)', color: 'var(--primary)', border: '1px solid var(--primary-border)', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {rc.code}
                      </code>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-highlight)' }}>{rc.owner}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rc.college}</div>
                    </td>
                    <td className="mono-cell">{rc.clicks}</td>
                    <td className="mono-cell">
                      <strong style={{ color: 'var(--text-highlight)' }}>{rc.signups}</strong>
                    </td>
                    <td className="mono-cell">
                      <span className="badge badge-green">{rc.conv}</span>
                    </td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{rc.date}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusai.nxtwave.io';
                          handleCopy(`${origin}/?ref=${rc.code}`, rc.code);
                        }}
                      >
                        {isCopied ? <Check size={12} style={{ color: '#34d399' }} /> : <Copy size={12} />}
                        {isCopied ? 'Copied' : 'Copy URL'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
