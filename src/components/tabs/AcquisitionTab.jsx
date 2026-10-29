import React, { useState } from 'react';
import {
  Share2,
  DollarSign,
  TrendingUp,
  MousePointerClick,
  Target,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  Layers,
  Info,
} from 'lucide-react';
import { useGrowthData, copyTextToClipboard } from '../../context/GrowthDataContext';

export const AcquisitionTab = () => {
  const {
    campaign,
    channels,
    totalRegistrations,
    totalSpend,
    blendedCac,
    outreachTemplates,
    activeReferralCode,
    showToast,
    setIsQuickRegOpen,
  } = useGrowthData();

  // Channel Category Filter
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Outreach Studio State
  const defaultRefLink = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${activeReferralCode || 'AI-GROWTH'}`
    : `https://campusai.nxtwave.io/?ref=${activeReferralCode || 'AI-GROWTH'}`;

  const [selectedTemplateId, setSelectedTemplateId] = useState(outreachTemplates[0]?.id || 'wa-direct');
  const [studentName, setStudentName] = useState('Rahul');
  const [collegeName, setCollegeName] = useState('VBIT Hyderabad');
  const [workshopDate, setWorkshopDate] = useState(campaign.workshopDate);
  const [referralLink, setReferralLink] = useState(defaultRefLink);
  const [isCopied, setIsCopied] = useState(false);

  const categories = [
    { id: 'all', label: 'All Channels' },
    { id: 'Organic Viral Loops', label: 'Viral Loops' },
    { id: 'Peer-to-Peer', label: 'Ambassadors' },
    { id: 'Community Partnership', label: 'College Clubs' },
    { id: 'Paid Social', label: 'Paid Boost' },
    { id: 'Offline to Online', label: 'Posters / QR' },
  ];

  const filteredChannels = channels.filter((ch) => {
    if (categoryFilter === 'all') return true;
    return ch.category === categoryFilter;
  });

  const totalClicks = channels.reduce((sum, ch) => sum + ch.clicks, 0);
  const avgConversion = totalClicks > 0 ? ((totalRegistrations / totalClicks) * 100).toFixed(1) : '0.0';

  // Message Interpolation
  const currentTemplate = outreachTemplates.find((t) => t.id === selectedTemplateId) || outreachTemplates[0];
  const finalMessage = currentTemplate
    ? currentTemplate.template
        .replace(/{{studentName}}/g, studentName.trim() || '[Student Name]')
        .replace(/{{collegeName}}/g, collegeName.trim() || '[College Name]')
        .replace(/{{workshopDate}}/g, workshopDate.trim() || '[Workshop Date]')
        .replace(/{{referralLink}}/g, referralLink.trim() || '[Registration Link]')
    : '';

  const handleCopyMessage = async () => {
    const success = await copyTextToClipboard(finalMessage);
    if (success) {
      setIsCopied(true);
      showToast('📋 Copied outreach template to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    } else {
      showToast('Failed to copy to clipboard', 'warning');
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(finalMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="view-container">
      {/* Executive Channel Stats Strip */}
      <div className="executive-kpi-bar">
        <div className="kpi-cell">
          <div className="kpi-cell-label">Blended Acquisition Cost</div>
          <div className="kpi-cell-val">
            <span className="mono-num">₹{blendedCac}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-green">Target: &lt; ₹4.00</span>
            <span className="kpi-caption">Spend: ₹{totalSpend} / ₹{campaign.totalBudget}</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Total Landing Views / Clicks</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{totalClicks.toLocaleString()}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-cyan">Inbound Traffic</span>
            <span className="kpi-caption">Across 6 channels</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Click-to-Registration Rate</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{avgConversion}%</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-indigo">{totalRegistrations} Signups</span>
            <span className="kpi-caption">High intent landing</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Remaining Budget Runway</div>
          <div className="kpi-cell-val">
            <span className="mono-num">₹{(campaign.totalBudget - totalSpend).toLocaleString()}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-purple">{100 - Math.round((totalSpend / campaign.totalBudget) * 100)}% Available</span>
            <span className="kpi-caption">Zero-cost channels lead</span>
          </div>
        </div>
      </div>

      {/* Part 1: Channel Performance & Unit Economics Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title-box">
            <h3>Acquisition Channels & Unit Economics</h3>
            <p className="card-subtitle">Tracking clicks, signups, conversion rates, and spend per acquisition channel</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setIsQuickRegOpen(true)}>
            + Test Channel Lead
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`btn btn-sm ${categoryFilter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategoryFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Channel Name</th>
                <th>Category</th>
                <th>Clicks</th>
                <th>Signups</th>
                <th>Conversion Rate</th>
                <th>Spend</th>
                <th>CAC</th>
                <th>Efficiency Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredChannels.map((ch) => (
                <tr key={ch.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ch.color }} />
                      <strong style={{ color: 'var(--text-highlight)' }}>{ch.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                      {ch.category}
                    </span>
                  </td>
                  <td className="mono-cell">{ch.clicks.toLocaleString()}</td>
                  <td className="mono-cell">
                    <strong>{ch.registrations}</strong>
                  </td>
                  <td className="mono-cell">
                    <span className="badge badge-indigo">{ch.conversionRate}%</span>
                  </td>
                  <td className="mono-cell">
                    {ch.spend === 0 ? (
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>₹0 (Organic)</span>
                    ) : (
                      <span>₹{ch.spend.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="mono-cell">
                    {ch.cac === 0 ? (
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>₹0.00</span>
                    ) : (
                      <span style={{ color: ch.cac > 10 ? 'var(--accent-amber)' : 'var(--text-highlight)' }}>
                        ₹{ch.cac.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td>
                    {ch.spend === 0 ? (
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Zero-Cost Viral</span>
                    ) : ch.cac <= 15 ? (
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Efficient Paid</span>
                    ) : (
                      <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Pacing Watch</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Outreach Message Studio */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3>Outreach Message Studio</h3>
            <p className="card-subtitle">
              Pre-crafted message templates for WhatsApp class groups, club discords, and campus influencer DMs
            </p>
          </div>
          <span className="badge badge-cyan">Deterministic Templates</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Controls & Variable Inputs */}
          <div>
            <div className="form-group">
              <label className="form-label">Select Outreach Angle & Channel</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {outreachTemplates.map((tmpl) => {
                  const isSelected = tmpl.id === selectedTemplateId;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--primary-tint)' : 'var(--bg-elevated)',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <strong style={{ fontSize: '0.85rem', color: isSelected ? 'var(--primary)' : 'var(--text-highlight)' }}>
                          {tmpl.name}
                        </strong>
                        <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                          {tmpl.channel}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {tmpl.useCase}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div className="form-group">
                <label htmlFor="student-name-var" className="form-label">Student / Recipient Name</label>
                <input
                  id="student-name-var"
                  type="text"
                  className="form-input"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rahul"
                />
              </div>

              <div className="form-group">
                <label htmlFor="college-name-var" className="form-label">Target College</label>
                <input
                  id="college-name-var"
                  type="text"
                  className="form-input"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. VBIT Hyderabad"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="workshop-date-var" className="form-label">Workshop Date & Time</label>
              <input
                id="workshop-date-var"
                type="text"
                className="form-input"
                value={workshopDate}
                onChange={(e) => setWorkshopDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ref-link-var" className="form-label">Attributed Registration Link</label>
              <input
                id="ref-link-var"
                type="text"
                className="form-input"
                value={referralLink}
                onChange={(e) => setReferralLink(e.target.value)}
              />
            </div>
          </div>

          {/* Live Message Preview & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-label" style={{ marginBottom: '8px' }}>
              Interpolated Message Preview
            </div>

            <div
              style={{
                flex: 1,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontFamily: 'inherit',
                fontSize: '0.84rem',
                lineHeight: '1.6',
                color: 'var(--text-main)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: '260px',
                overflowY: 'auto',
                marginBottom: '16px',
              }}
            >
              {finalMessage}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleCopyMessage}
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                <span>{isCopied ? 'Copied to Clipboard' : 'Copy Formatted Text'}</span>
              </button>

              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'center' }}
                onClick={handleWhatsAppShare}
                title="Open WhatsApp Web prefilled with this message"
              >
                <Send size={15} />
                <span>Open WhatsApp Web</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
