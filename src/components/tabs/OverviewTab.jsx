import React from 'react';
import {
  Users,
  Wallet,
  TrendingUp,
  Target,
  Sparkles,
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Share2,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';
import { MetricCard } from '../MetricCard';

export const OverviewTab = () => {
  const {
    campaign,
    dailyMetrics,
    channels,
    totalRegistrations,
    totalSpend,
    blendedCac,
    velocity,
    remainingRegistrations,
    remainingDays,
    neededDailyVelocity,
    projectedFinal,
    progressPercent,
    budgetPercent,
    setActiveTab,
    setIsQuickRegOpen,
    registrations,
  } = useGrowthData();

  // Find max value for 7-day chart scaling
  const maxDayVal = Math.max(...dailyMetrics.map((d) => Math.max(d.target, d.actual)), 120);

  return (
    <div className="view-container">
      {/* Top Cockpit Banner */}
      <div className="campaign-banner">
        <div className="banner-content">
          <div className="banner-icon-box">
            <Zap size={26} />
          </div>
          <div className="banner-text">
            <h3>{campaign.title}</h3>
            <p>
              NxtWave Growth Challenge • Target: <strong>{campaign.targetRegistrations} Registrations</strong> in{' '}
              <strong>{campaign.totalDays} Days</strong> with a strict budget of{' '}
              <strong>₹{campaign.totalBudget.toLocaleString()} INR</strong>.
            </p>
          </div>
        </div>

        <div className="banner-metrics">
          <div className="banner-stat">
            <div className="banner-stat-value" style={{ color: 'var(--primary)' }}>
              Day {campaign.currentDay} / {campaign.totalDays}
            </div>
            <div className="banner-stat-label">Timeline Status</div>
          </div>
          <div className="banner-stat">
            <div className="banner-stat-value" style={{ color: 'var(--accent-emerald)' }}>
              {progressPercent}%
            </div>
            <div className="banner-stat-label">Goal Progress</div>
          </div>
          <div className="banner-stat">
            <div className="banner-stat-value" style={{ color: 'var(--accent-amber)' }}>
              ₹{(campaign.totalBudget - totalSpend).toLocaleString()}
            </div>
            <div className="banner-stat-label">Budget Runway</div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="kpi-grid">
        <MetricCard
          label="Total Registrations"
          value={totalRegistrations}
          subtext={`Goal: ${campaign.targetRegistrations} (${remainingRegistrations} remaining)`}
          icon={Users}
          badgeText={`${progressPercent}% Achieved`}
          badgeType="positive"
          progressValue={progressPercent}
          accentColor="#6D5CE8"
          onClick={() => setActiveTab('registrations')}
        />

        <MetricCard
          label="Budget Utilized"
          value={`₹${totalSpend.toLocaleString()}`}
          subtext={`Total Cap: ₹${campaign.totalBudget} (₹${campaign.totalBudget - totalSpend} left)`}
          icon={Wallet}
          badgeText={`${budgetPercent}% Spent`}
          badgeType={budgetPercent > 80 ? 'warning' : 'neutral'}
          progressValue={budgetPercent}
          accentColor="#0284C7"
          onClick={() => setActiveTab('channels')}
        />

        <MetricCard
          label="Blended CAC"
          value={`₹${blendedCac}`}
          subtext="Cost per confirmed registration"
          icon={Target}
          badgeText="Target: < ₹4.00"
          badgeType="positive"
          accentColor="#10B981"
          onClick={() => setActiveTab('channels')}
        />

        <MetricCard
          label="Run-Rate Velocity"
          value={`${velocity}/day`}
          subtext={`Need ${neededDailyVelocity}/day for next ${remainingDays} days`}
          icon={TrendingUp}
          badgeText={`Pacing: ~${projectedFinal} total`}
          badgeType={projectedFinal >= 500 ? 'positive' : 'warning'}
          accentColor="#D97706"
          onClick={() => setActiveTab('progress')}
        />
      </div>

      {/* Middle Row: 7-Day Velocity Chart & Channel Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* 7-Day Velocity Chart */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>7-Day Registration Pace vs Target</h3>
              <p className="card-subtitle">Daily targets vs actual student registrations</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.74rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--border-subtle)', borderRadius: '2px' }} /> Target
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '2px' }} /> Actual
              </span>
            </div>
          </div>

          <div className="chart-bar-container">
            {dailyMetrics.map((dayItem) => {
              const targetHeight = Math.round((dayItem.target / maxDayVal) * 150);
              const actualHeight = Math.round((dayItem.actual / maxDayVal) * 150);
              const isToday = dayItem.day === campaign.currentDay;

              return (
                <div key={dayItem.day} className="chart-col">
                  <div className="chart-tooltip">
                    Day {dayItem.day}: {dayItem.actual > 0 ? `${dayItem.actual} actual` : 'Upcoming'} / {dayItem.target} target
                  </div>
                  <div className="chart-bar-wrap">
                    <div className="bar-target" style={{ height: `${targetHeight}px` }} title={`Target: ${dayItem.target}`} />
                    <div
                      className={`bar-actual ${isToday ? 'today' : ''}`}
                      style={{ height: `${actualHeight}px` }}
                      title={`Actual: ${dayItem.actual}`}
                    />
                  </div>
                  <span className="chart-col-label" style={{ fontWeight: isToday ? '700' : '500', color: isToday ? 'var(--primary)' : 'var(--text-muted)' }}>
                    D{dayItem.day} {isToday ? '• Now' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} style={{ color: 'var(--accent-amber)' }} />
              <span style={{ fontSize: '0.84rem' }}>
                <strong>Growth Momentum:</strong> Running <strong>+18.6% ahead</strong> of target trajectory.
              </span>
            </div>
            <button className="btn btn-outline-cyan btn-sm" onClick={() => setActiveTab('progress')}>
              Deep Dive
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Acquisition Channel Contributions */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Acquisition Channel Share</h3>
              <p className="card-subtitle">Where registrations originate & unit economics</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('channels')}>
              Full Breakdown
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {channels.map((channel) => {
              const share = totalRegistrations > 0 ? Math.round((channel.registrations / totalRegistrations) * 100) : 0;
              return (
                <div key={channel.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.84rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: channel.color }} />
                      {channel.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-highlight)' }}>{channel.registrations}</strong> signups ({share}%)
                    </span>
                  </div>
                  <div style={{ height: '7px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${share}%`,
                        backgroundColor: channel.color,
                        borderRadius: '999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Top CAC Driver: WhatsApp Viral Loops (₹0.00 CAC)</span>
            <span>Paid Social: Instagram (₹15.53 CAC)</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Key Growth Levers & Recent Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Core Growth Levers & Hackathon Strategy */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Core Growth Strategy Levers</h3>
              <p className="card-subtitle">How we reach 500 students with only ₹2,000 budget</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('experiments')}>
              View Experiments
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '14px', padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--primary)', marginTop: '2px' }}>
                <Share2 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-highlight)', fontWeight: '700', marginBottom: '3px' }}>
                  1. Zero-Cost Peer Forwarding Loops
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Rather than expensive broad ads, students receive pre-formatted WhatsApp text with an interactive AI project hook. Converts class groups into self-sustaining viral loops.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--accent-cyan)', marginTop: '2px' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-highlight)', fontWeight: '700', marginBottom: '3px' }}>
                  2. Gamified Campus Ambassador Incentives
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  12 campus leads across top colleges (VBIT, SRM, COEP, RVCE, KIIT). Replaced cash bounties with high-value proof-of-work rewards (1-on-1 AI Mentorship & Letter of Recommendation).
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--accent-emerald)', marginTop: '2px' }}>
                <Target size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-highlight)', fontWeight: '700', marginBottom: '3px' }}>
                  3. Controlled ₹150/Day Micro-Paid Boost
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Spent ₹590 total on hyper-targeted Instagram reels showcasing a 15-second code snippet. Seeds initial momentum while keeping blended CAC at a lean ₹3.63.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Demo Registration Activity Feed */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Live Intake Activity (Demo)</h3>
              <p className="card-subtitle">Real-time incoming student registrations</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsQuickRegOpen(true)}>
              + Simulate Registration
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {registrations.slice(0, 5).map((reg) => (
              <div
                key={reg.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
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
                      fontSize: '0.78rem',
                      fontWeight: '700',
                    }}
                  >
                    {reg.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-highlight)' }}>
                      {reg.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {reg.college} • <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{reg.channel}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.68rem', marginBottom: '2px' }}>
                    <CheckCircle2 size={11} /> Verified
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{reg.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('registrations')}>
              View all {registrations.length} registrations & filters
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
