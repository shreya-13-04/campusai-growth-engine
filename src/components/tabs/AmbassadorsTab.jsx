import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Gift,
  Copy,
  Check,
  UserPlus,
  Flame,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';
import { MetricCard } from '../MetricCard';

export const AmbassadorsTab = () => {
  const {
    ambassadors,
    addReferralCode,
    showToast,
  } = useGrowthData();

  const [copiedCode, setCopiedCode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddAmbModalOpen, setIsAddAmbModalOpen] = useState(false);

  // Form state
  const [newAmbName, setNewAmbName] = useState('');
  const [newAmbCollege, setNewAmbCollege] = useState('');
  const [newAmbYear, setNewAmbYear] = useState('2nd Year CSE');
  const [newAmbCode, setNewAmbCode] = useState('');

  const handleCopyLink = async (code) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campusai.nxtwave.io';
    const link = `${origin}/?ref=${code}`;
    await copyTextToClipboard(link);
    setCopiedCode(code);
    showToast(`📋 Copied shareable link: ${link}`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddAmbassador = (e) => {
    e.preventDefault();
    if (!newAmbName.trim() || !newAmbCollege.trim()) {
      showToast('Please enter both Ambassador Name and College.', 'info');
      return;
    }

    addReferralCode({
      ownerName: newAmbName.trim(),
      college: newAmbCollege.trim(),
      customCode: newAmbCode.trim() || `AI-${newAmbName.split(' ')[0].toUpperCase()}`,
      isAmbassador: true,
    });

    setNewAmbName('');
    setNewAmbCollege('');
    setNewAmbCode('');
    setIsAddAmbModalOpen(false);
  };

  // Sort by referrals descending
  const sortedAmbassadors = [...ambassadors].sort((a, b) => b.referrals - a.referrals);

  const filteredAmbassadors = sortedAmbassadors.filter((amb) => {
    const q = searchTerm.toLowerCase();
    return (
      amb.name.toLowerCase().includes(q) ||
      amb.college.toLowerCase().includes(q) ||
      amb.code.toLowerCase().includes(q)
    );
  });

  const totalAmbassadorReferrals = ambassadors.reduce((sum, amb) => sum + amb.referrals, 0);

  return (
    <div className="view-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2>Campus Ambassador Network Leaderboard</h2>
          <p className="section-desc">
            Student growth leaders driving hyper-local word of mouth across engineering institutions. Gamified with milestone tiers and high-impact career rewards.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddAmbModalOpen(true)}>
            <UserPlus size={15} />
            + Onboard Ambassador
          </button>
        </div>
      </div>

      {/* Top Ambassador Stats */}
      <div className="kpi-grid">
        <MetricCard
          label="Active Campus Ambassadors"
          value={ambassadors.length}
          subtext="Representing 10+ tech universities"
          icon={Trophy}
          badgeText="Active Fleet"
          badgeType="positive"
          accentColor="#6D5CE8"
        />

        <MetricCard
          label="Ambassador Referrals"
          value={totalAmbassadorReferrals}
          subtext="Confirmed workshop registrations"
          icon={Flame}
          badgeText="30.4% of total signups"
          badgeType="positive"
          accentColor="#0284C7"
        />

        <MetricCard
          label="Top Ambassador Volume"
          value={sortedAmbassadors[0]?.referrals || 0}
          subtext={`${sortedAmbassadors[0]?.name || 'Leader'} (${sortedAmbassadors[0]?.college.split(',')[0]})`}
          icon={Award}
          badgeText="Gold Tier Leader"
          badgeType="positive"
          accentColor="#D97706"
        />

        <MetricCard
          label="Unlocked Rewards"
          value={ambassadors.filter((a) => a.referrals >= 15).length}
          subtext="Ambassadors unlocked 1-on-1 Mentorship"
          icon={Gift}
          badgeText="High Retention"
          badgeType="positive"
          accentColor="#10B981"
        />
      </div>

      {/* Search Bar & Rewards Tier Guide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0, padding: '16px 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search ambassador by name, college, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Milestone Rewards Explainer */}
        <div className="card" style={{ marginBottom: 0, padding: '16px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Gamified Milestone Ladder
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <span><strong>5 Refs:</strong> AI Prompt Kit + Badge</span>
            <span><strong>15 Refs:</strong> 1-on-1 Resume Review</span>
            <span><strong>30 Refs:</strong> NxtWave Swag Box</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3>University Evangelist Standings</h3>
            <p className="card-subtitle">Real-time referral count and rewards progress</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Ambassador</th>
                <th>Institution</th>
                <th>Referral Code</th>
                <th>Signups</th>
                <th>Milestone Target</th>
                <th>Tier</th>
                <th>Reward Unlocked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAmbassadors.map((amb, index) => {
                const isCopied = copiedCode === amb.code;
                const progressToTarget = Math.min(100, Math.round((amb.referrals / amb.target) * 100));

                let badgeClass = 'badge-gold';
                if (amb.tier.includes('Silver')) badgeClass = 'badge-silver';
                if (amb.tier.includes('Bronze')) badgeClass = 'badge-bronze';
                if (amb.tier.includes('Rising')) badgeClass = 'badge-indigo';

                return (
                  <tr key={amb.id}>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'var(--bg-elevated)',
                          border: index > 2 ? '1px solid var(--border-subtle)' : 'none',
                          color: index < 3 ? '#ffffff' : 'var(--text-muted)',
                          fontWeight: '800',
                          fontSize: '0.76rem',
                        }}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--primary-tint)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                          }}
                        >
                          {amb.avatar || amb.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-highlight)' }}>{amb.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{amb.year || 'Ambassador'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', maxWidth: '200px' }}>
                      <span title={amb.college}>{amb.college}</span>
                    </td>
                    <td>
                      <code style={{ background: 'var(--primary-tint)', border: '1px solid var(--primary-border)', padding: '3px 7px', borderRadius: '4px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700' }}>
                        {amb.code}
                      </code>
                    </td>
                    <td className="mono-cell">
                      <strong style={{ fontSize: '1rem', color: 'var(--text-highlight)' }}>{amb.referrals}</strong>
                    </td>
                    <td>
                      <div style={{ width: '100px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                          <span>{amb.referrals} / {amb.target}</span>
                          <span>{progressToTarget}%</span>
                        </div>
                        <div style={{ height: '5px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${progressToTarget}%`,
                              background: 'linear-gradient(90deg, var(--primary) 0%, #8B5CF6 100%)',
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${badgeClass}`}>{amb.tier}</span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {amb.rewardUnlocked}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCopyLink(amb.code)}
                        title="Copy Ambassador Registration Link"
                      >
                        {isCopied ? <Check size={13} style={{ color: '#34d399' }} /> : <Copy size={13} />}
                        <span>{isCopied ? 'Copied' : 'Link'}</span>
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
              <h3 className="modal-title">Onboard New Campus Ambassador</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsAddAmbModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddAmbassador}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Ambassador Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Priyanshu Sharma"
                    value={newAmbName}
                    onChange={(e) => setNewAmbName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">College / University *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. NIT Trichy or Thapar Institute"
                    value={newAmbCollege}
                    onChange={(e) => setNewAmbCollege(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Year / Branch</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 3rd Year CSE"
                    value={newAmbYear}
                    onChange={(e) => setNewAmbYear(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Custom Referral Code (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. AI-PRIYANSHU (Leave blank to auto-generate)"
                    value={newAmbCode}
                    onChange={(e) => setNewAmbCode(e.target.value.toUpperCase())}
                  />
                  <div className="form-hint">Unique referral tag applied to workshop signups</div>
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
