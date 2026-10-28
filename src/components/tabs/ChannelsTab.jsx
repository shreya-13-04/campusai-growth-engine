import React, { useState } from 'react';
import {
  Share2,
  DollarSign,
  TrendingUp,
  MousePointerClick,
  Users,
  Target,
  Filter,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';
import { MetricCard } from '../MetricCard';

export const ChannelsTab = () => {
  const {
    campaign,
    channels,
    totalRegistrations,
    totalSpend,
    blendedCac,
    setActiveTab,
    setIsQuickRegOpen,
  } = useGrowthData();

  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Channels' },
    { id: 'Organic Viral Loops', label: 'Viral Loops' },
    { id: 'Peer-to-Peer', label: 'Ambassadors' },
    { id: 'Community Partnership', label: 'College Clubs' },
    { id: 'Paid Social', label: 'Paid Boost' },
    { id: 'Offline to Online', label: 'Campus Posters/QR' },
  ];

  const filteredChannels = channels.filter((ch) => {
    if (categoryFilter === 'all') return true;
    return ch.category === categoryFilter;
  });

  return (
    <div className="view-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2>Acquisition Channels & Unit Economics</h2>
          <p className="section-desc">
            Deep dive into multi-channel performance across organic viral loops, campus ambassadors, paid micro-boosts, and college tech communities.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsQuickRegOpen(true)}>
          + Test Channel Lead
        </button>
      </div>

      {/* Top Unit Economics Cards */}
      <div className="kpi-grid">
        <MetricCard
          label="Blended CAC"
          value={`₹${blendedCac}`}
          subtext="Total Spend / Total Signups"
          icon={Target}
          badgeText="Highly Efficient"
          badgeType="positive"
          accentColor="#10B981"
        />

        <MetricCard
          label="Total Channel Clicks"
          value={channels.reduce((sum, ch) => sum + ch.clicks, 0).toLocaleString()}
          subtext="Unique landing page visits"
          icon={MousePointerClick}
          badgeText="High Intent"
          badgeType="neutral"
          accentColor="#0284C7"
        />

        <MetricCard
          label="Average Conversion Rate"
          value={`${(
            (totalRegistrations / channels.reduce((sum, ch) => sum + ch.clicks, 0)) *
            100
          ).toFixed(1)}%`}
          subtext="Click-to-Registration efficiency"
          icon={TrendingUp}
          badgeText="Benchmark: > 12%"
          badgeType="positive"
          accentColor="#6D5CE8"
        />

        <MetricCard
          label="Bootstrapped Spend"
          value={`₹${totalSpend.toLocaleString()}`}
          subtext={`Budget: ₹${campaign.totalBudget.toLocaleString()} INR Cap`}
          icon={DollarSign}
          badgeText={`₹${Math.max(0, campaign.totalBudget - totalSpend).toLocaleString()} Remaining`}
          badgeType="positive"
          accentColor="#D97706"
        />
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
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

      {/* Channels Detailed Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3>Multi-Channel Performance Matrix</h3>
            <p className="card-subtitle">
              Evaluating clicks, signups, conversion percentage, budget allocation, and customer acquisition cost
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Channel Name</th>
                <th>Category</th>
                <th>Clicks</th>
                <th>Registrations</th>
                <th>Conv. Rate</th>
                <th>Spend (₹)</th>
                <th>Channel CAC</th>
                <th>Efficiency Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredChannels.map((channel) => {
                const shareOfRegs = totalRegistrations > 0 ? ((channel.registrations / totalRegistrations) * 100).toFixed(1) : 0;
                return (
                  <tr key={channel.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: channel.color,
                          }}
                        />
                        <strong style={{ color: 'var(--text-highlight)' }}>{channel.name}</strong>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px', marginLeft: '18px' }}>
                        {channel.growthTactic}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                        {channel.category}
                      </span>
                    </td>
                    <td className="mono-cell">{channel.clicks}</td>
                    <td className="mono-cell">
                      <strong style={{ color: '#38bdf8' }}>{channel.registrations}</strong>{' '}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>({shareOfRegs}%)</span>
                    </td>
                    <td className="mono-cell">
                      <span style={{ color: channel.conversionRate >= 15 ? '#34d399' : 'var(--text-main)', fontWeight: '600' }}>
                        {channel.conversionRate}%
                      </span>
                    </td>
                    <td className="mono-cell">₹{channel.spend}</td>
                    <td className="mono-cell">
                      {channel.cac === 0 ? (
                        <span className="badge badge-green">₹0.00 (Free)</span>
                      ) : (
                        <span style={{ color: channel.cac < 10 ? '#34d399' : '#fbbf24', fontWeight: '600' }}>
                          ₹{channel.cac.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${channel.cac === 0 || channel.cac < 5 ? 'badge-green' : 'badge-gold'}`}>
                        {channel.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insights Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-highlight)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#25D366' }}>●</span> WhatsApp Viral Loop Anatomy
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            By structuring the WhatsApp broadcast as a forwardable curiosity message with a code-along preview link, we achieved <strong>{channels.find((c) => c.id === 'whatsapp-groups')?.registrations || 128} registrations with zero ad spend</strong>. Each student who registers is prompted with a 1-click share button to invite their college lab group.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-highlight)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#6366F1' }}>●</span> Ambassador Network Economics
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            ₹{channels.find((c) => c.id === 'ambassadors')?.spend || 450} was set aside for ambassador milestone rewards. At <strong>{channels.find((c) => c.id === 'ambassadors')?.registrations || 104} registrations</strong>, the effective CAC is <strong>₹{channels.find((c) => c.id === 'ambassadors')?.cac?.toFixed(2) || '4.33'}</strong>, delivering verified workshop live attendance intent.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-highlight)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#E1306C' }}>●</span> Micro-Targeted Instagram Paid Boost
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Used ₹{channels.find((c) => c.id === 'instagram-boost')?.spend || 590} to run targeted ₹150/day reels directly to CS/IT students. Delivered <strong>{channels.find((c) => c.id === 'instagram-boost')?.registrations || 38} registrations</strong> at CAC of <strong>₹{channels.find((c) => c.id === 'instagram-boost')?.cac?.toFixed(2) || '15.53'}</strong>, providing crucial initial seed momentum.
          </p>
        </div>
      </div>
    </div>
  );
};
