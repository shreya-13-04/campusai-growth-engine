import React, { useState } from 'react';
import {
  MessageSquareText,
  Copy,
  Check,
  Send,
  Sparkles,
  Info,
  Layers,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';

export const OutreachStudioTab = () => {
  const { outreachTemplates, campaign, activeReferralCode, showToast } = useGrowthData();

  const defaultRefLink = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${activeReferralCode || 'AI-GROWTH'}`
    : `https://campusai.nxtwave.io/register?ref=${activeReferralCode || 'AI-GROWTH'}`;

  const [selectedTemplateId, setSelectedTemplateId] = useState(outreachTemplates[0].id);
  const [studentName, setStudentName] = useState('Rahul');
  const [collegeName, setCollegeName] = useState('VBIT Hyderabad');
  const [workshopDate, setWorkshopDate] = useState(campaign.workshopDate);
  const [referralLink, setReferralLink] = useState(defaultRefLink);
  const [customHook, setCustomHook] = useState('AI Resume Evaluator in 15 lines of code');
  const [isCopied, setIsCopied] = useState(false);

  const currentTemplate = outreachTemplates.find((t) => t.id === selectedTemplateId) || outreachTemplates[0];

  // Template string interpolation
  const interpolateMessage = (templateStr) => {
    return templateStr
      .replace(/{{studentName}}/g, studentName || '[Student Name]')
      .replace(/{{collegeName}}/g, collegeName || '[College Name]')
      .replace(/{{workshopDate}}/g, workshopDate || '[Workshop Date]')
      .replace(/{{referralLink}}/g, referralLink || '[Registration Link]')
      .replace(/{{customHook}}/g, customHook || '[Project Highlight]');
  };

  const finalMessage = interpolateMessage(currentTemplate.template);

  const handleCopy = async () => {
    await copyTextToClipboard(finalMessage);
    setIsCopied(true);
    showToast('📋 Copied outreach template to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(finalMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="view-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2>AI Outreach Studio</h2>
          <p className="section-desc">
            Generate high-converting, personalized outreach copy for WhatsApp class groups, club discords, and Instagram DMs.
          </p>
        </div>

        {/* Clear transparent disclaimer as requested */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent-cyan-tint)',
            border: '1px solid var(--accent-cyan-border)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.74rem',
            color: 'var(--accent-cyan-text)',
            fontWeight: '600',
          }}
        >
          <Info size={14} />
          <span>Template-assisted generator (deterministic, zero external API costs)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        {/* Left Side: Controls & Variables */}
        <div>
          {/* Template Selector */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <div className="card-title-box">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} style={{ color: 'var(--primary)' }} />
                  Select Channel & Angle
                </h3>
                <p className="card-subtitle">Curated message blueprints tested for high conversion</p>
              </div>
            </div>

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
                      background: isSelected ? 'var(--primary-tint)' : 'var(--bg-elevated)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <strong style={{ fontSize: '0.88rem', color: isSelected ? 'var(--primary)' : 'var(--text-highlight)' }}>
                        {tmpl.name}
                      </strong>
                      <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                        {tmpl.channel}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Best for: {tmpl.bestFor}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Variables Form */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-box">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} />
                  Personalization Variables
                </h3>
                <p className="card-subtitle">Values inject automatically into the live preview</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Student / Recipient Name</label>
              <input
                type="text"
                className="form-input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Rahul or Friends"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target College / Institution</label>
              <input
                type="text"
                className="form-input"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. VBIT Hyderabad"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Workshop Date & Time</label>
              <input
                type="text"
                className="form-input"
                value={workshopDate}
                onChange={(e) => setWorkshopDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Referral Registration Link</label>
              <input
                type="text"
                className="form-input"
                value={referralLink}
                onChange={(e) => setReferralLink(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Live Formatted Preview & Actions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Live Message Preview</h3>
              <p className="card-subtitle">
                Tone: <strong style={{ color: 'var(--primary)' }}>{currentTemplate.tone}</strong> • Ready to dispatch
              </p>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {finalMessage.length} chars • ~{Math.ceil(finalMessage.split(' ').length / 200)} min read
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'pre-wrap',
              fontSize: '0.88rem',
              lineHeight: '1.65',
              color: 'var(--text-main)',
              marginBottom: '20px',
              minHeight: '340px',
            }}
          >
            {finalMessage}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleCopy} style={{ flex: 1, justifyContent: 'center' }}>
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
              {isCopied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}
            </button>

            {currentTemplate.channel === 'WhatsApp' && (
              <button
                className="btn btn-outline-cyan"
                onClick={handleWhatsAppShare}
                title="Launch in WhatsApp Web with pre-filled message"
              >
                <Send size={16} />
                Send via WhatsApp Web
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
