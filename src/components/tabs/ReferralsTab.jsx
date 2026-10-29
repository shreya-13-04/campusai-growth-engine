import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Link2,
  MousePointerClick,
  TrendingUp,
  Trophy,
  Copy,
  Check,
  UserPlus,
  Sparkles,
  QrCode,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useGrowthData, copyTextToClipboard } from '../../context/GrowthDataContext';

export const ReferralsTab = () => {
  const {
    referralCodes,
    ambassadors,
    addReferralCode,
    showToast,
  } = useGrowthData();

  // Generator form state
  const [ownerName, setOwnerName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [isAmbassadorCheck, setIsAmbassadorCheck] = useState(true);
  const [generatedResult, setGeneratedResult] = useState(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    return {
      code: 'AI-ADITYA',
      owner: 'Aditya Sharma',
      college: 'IIT Bombay',
      url: `${origin}/?ref=AI-ADITYA`,
    };
  });
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (generatedResult?.url) {
      QRCode.toDataURL(generatedResult.url, {
        width: 160,
        margin: 1,
        color: {
          dark: '#252331',
          light: '#FFFFFF',
        },
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [generatedResult?.url]);
  const [copiedKey, setCopiedKey] = useState(null);

  // Ambassador search state
  const [ambSearch, setAmbSearch] = useState('');
  const [isAddAmbModalOpen, setIsAddAmbModalOpen] = useState(false);
  const [newAmbName, setNewAmbName] = useState('');
  const [newAmbCollege, setNewAmbCollege] = useState('');
  const [newAmbCode, setNewAmbCode] = useState('');

  const totalReferralClicks = referralCodes.reduce((sum, rc) => sum + rc.clicks, 0);
  const totalReferralSignups = referralCodes.reduce((sum, rc) => sum + rc.signups, 0);
  const convRate = totalReferralClicks > 0 ? ((totalReferralSignups / totalReferralClicks) * 100).toFixed(1) : '0.0';

  const handleGenerateCode = (e) => {
    e.preventDefault();
    if (!ownerName.trim()) {
      showToast('Please enter promoter or campus lead name', 'warning');
      return;
    }

    const assignedCode = addReferralCode({
      ownerName: ownerName.trim(),
      college: collegeName.trim() || 'Campus General',
      customCode: customSuffix.trim() || undefined,
      isAmbassador: isAmbassadorCheck,
    });

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusai.nxtwave.io';
    const finalUrl = `${origin}/?ref=${assignedCode}`;

    setGeneratedResult({
      code: assignedCode,
      owner: ownerName.trim(),
      college: collegeName.trim() || 'Campus General',
      url: finalUrl,
    });

    setOwnerName('');
    setCollegeName('');
    setCustomSuffix('');
  };

  const handleCopy = async (text, key) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedKey(key);
      showToast('📋 Copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2500);
    } else {
      showToast('Failed to copy', 'warning');
    }
  };

  const handleAddAmbassadorSubmit = (e) => {
    e.preventDefault();
    if (!newAmbName.trim()) {
      showToast('Please enter ambassador name', 'warning');
      return;
    }

    addReferralCode({
      ownerName: newAmbName.trim(),
      college: newAmbCollege.trim() || 'Engineering College',
      customCode: newAmbCode.trim() || undefined,
      isAmbassador: true,
    });

    setNewAmbName('');
    setNewAmbCollege('');
    setNewAmbCode('');
    setIsAddAmbModalOpen(false);
  };

  // Sort ambassadors by referrals descending
  const sortedAmbassadors = [...ambassadors].sort((a, b) => b.referrals - a.referrals);
  const filteredAmbassadors = sortedAmbassadors.filter((amb) => {
    const q = ambSearch.toLowerCase();
    return (
      amb.name.toLowerCase().includes(q) ||
      amb.college.toLowerCase().includes(q) ||
      amb.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="view-container">
      {/* Key Referral Stats Strip */}
      <div className="executive-kpi-bar">
        <div className="kpi-cell">
          <div className="kpi-cell-label">Active Campus Ambassadors</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{ambassadors.length}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-indigo">12 Campus Hubs</span>
            <span className="kpi-caption">Student growth leaders</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Total Referral Clicks</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{totalReferralClicks.toLocaleString()}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-cyan">Inbound Links</span>
            <span className="kpi-caption">Tracked unique clicks</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Attributed Signups</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{totalReferralSignups}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-green">31% of Total</span>
            <span className="kpi-caption">Zero cash cost</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Referral Conversion Rate</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{convRate}%</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-purple">High Conviction</span>
            <span className="kpi-caption">Click-to-registration</span>
          </div>
        </div>
      </div>

      {/* Row 1: Code Generator & QR Code Preview Asset */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Code Generator Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Instant Referral Code Generator</h3>
              <p className="card-subtitle">Generate a collision-free trackable link and printable QR stamp</p>
            </div>
          </div>

          <form onSubmit={handleGenerateCode}>
            <div className="form-group">
              <label htmlFor="gen-owner" className="form-label">Promoter / Club / Lead Name *</label>
              <input
                id="gen-owner"
                type="text"
                required
                className="form-input"
                placeholder="e.g. ACM Student Chapter or Priya Nair"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gen-college" className="form-label">College / Community</label>
              <input
                id="gen-college"
                type="text"
                className="form-input"
                placeholder="e.g. IIT Madras, BITS Pilani, or Discord Tech Hub"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gen-code" className="form-label">Custom Code Suffix (Optional)</label>
              <input
                id="gen-code"
                type="text"
                className="form-input"
                placeholder="e.g. AI-ACM50 (Default: AI-{NAME})"
                value={customSuffix}
                onChange={(e) => setCustomSuffix(e.target.value.toUpperCase())}
              />
              <div className="form-hint">Existing codes are automatically protected with a unique numeric suffix</div>
            </div>

            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="is-amb"
                type="checkbox"
                checked={isAmbassadorCheck}
                onChange={(e) => setIsAmbassadorCheck(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <label htmlFor="is-amb" style={{ fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                Also add to Campus Ambassador Leaderboard
              </label>
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
              <p className="card-subtitle">Ready for WhatsApp batch broadcasts, posters, and campus group forwards</p>
            </div>
          </div>

          {generatedResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              {/* Branded QR Box */}
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for ${generatedResult.code}`}
                    width="120"
                    height="120"
                    style={{ display: 'block', borderRadius: '4px' }}
                  />
                ) : (
                  <div style={{ width: 120, height: 120, background: '#F6F4EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={40} style={{ opacity: 0.3 }} />
                  </div>
                )}
                <span className="mono-num" style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {generatedResult.code}
                </span>
              </div>

              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-highlight)' }}>
                  {generatedResult.owner} ({generatedResult.college})
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '4px 0 12px', wordBreak: 'break-all' }}>
                  <code style={{ background: 'var(--primary-tint)', padding: '2px 6px', borderRadius: '4px' }}>
                    {generatedResult.url}
                  </code>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCopy(generatedResult.url, 'gen-url')}
                  >
                    {copiedKey === 'gen-url' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedKey === 'gen-url' ? 'Copied' : 'Copy Campaign URL'}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleCopy(generatedResult.code, 'gen-code')}
                  >
                    {copiedKey === 'gen-code' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedKey === 'gen-code' ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <QrCode size={44} style={{ opacity: 0.35, marginBottom: '12px' }} />
              <p style={{ fontSize: '0.84rem' }}>
                Enter promoter or club details on the left to generate an active code and printable QR stamp.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Campus Ambassador Leaderboard */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-box">
            <h3>Campus Ambassador Leaderboard</h3>
            <p className="card-subtitle">Student ambassadors ranked by verified student registrations</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search ambassador or code..."
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '0.78rem', padding: '6px 10px 6px 32px' }}
                value={ambSearch}
                onChange={(e) => setAmbSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsAddAmbModalOpen(true)}>
              <UserPlus size={14} />
              + Onboard Ambassador
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Ambassador</th>
                <th>Institution</th>
                <th>Referral Tag</th>
                <th>Signups Attributed</th>
                <th>Tier Level</th>
                <th>Milestone Reward</th>
                <th>Share Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredAmbassadors.map((amb, idx) => {
                const isCopied = copiedKey === amb.code;
                const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusai.nxtwave.io';
                const shareLink = `${origin}/?ref=${amb.code}`;

                return (
                  <tr key={amb.id || amb.code}>
                    <td>
                      {idx === 0 ? (
                        <span className="badge badge-amber" style={{ fontWeight: '800' }}>🥇 #1</span>
                      ) : idx === 1 ? (
                        <span className="badge badge-neutral" style={{ fontWeight: '800' }}>🥈 #2</span>
                      ) : idx === 2 ? (
                        <span className="badge badge-neutral" style={{ fontWeight: '800' }}>🥉 #3</span>
                      ) : (
                        <span className="mono-cell" style={{ fontWeight: '600' }}>#{idx + 1}</span>
                      )}
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-highlight)' }}>{amb.name}</strong>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{amb.college}</td>
                    <td>
                      <code style={{ background: 'var(--primary-tint)', color: 'var(--primary)', border: '1px solid var(--primary-border)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                        {amb.code}
                      </code>
                    </td>
                    <td className="mono-cell">
                      <strong style={{ color: 'var(--text-highlight)' }}>{amb.referrals}</strong>
                    </td>
                    <td>
                      <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                        {amb.tier}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {amb.rewardUnlocked}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCopy(shareLink, amb.code)}
                        title="Copy direct referral link"
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        {isCopied ? 'Copied' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Active Campaign Referral Codes Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3>Active Campaign Referral Codes</h3>
            <p className="card-subtitle">Tracking clicks, signups, and conversion efficiencies across all circulating codes</p>
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
                const isCopied = copiedKey === `rc-${rc.code}`;
                const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusai.nxtwave.io';
                const shareUrl = `${origin}/?ref=${rc.code}`;

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
                        onClick={() => handleCopy(shareUrl, `rc-${rc.code}`)}
                      >
                        {isCopied ? <Check size={12} /> : <Copy size={12} />}
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

      {/* Onboard Ambassador Modal */}
      {isAddAmbModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddAmbModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Onboard Campus Ambassador</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsAddAmbModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddAmbassadorSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="amb-name" className="form-label">Full Name *</label>
                  <input
                    id="amb-name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Tanmay Joshi"
                    value={newAmbName}
                    onChange={(e) => setNewAmbName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amb-col" className="form-label">College / University *</label>
                  <input
                    id="amb-col"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. DTU Delhi"
                    value={newAmbCollege}
                    onChange={(e) => setNewAmbCollege(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amb-code" className="form-label">Custom Referral Code (Optional)</label>
                  <input
                    id="amb-code"
                    type="text"
                    className="form-input"
                    placeholder="e.g. AI-TANMAY (Auto-assigned if blank)"
                    value={newAmbCode}
                    onChange={(e) => setNewAmbCode(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddAmbModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Onboard & Generate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
