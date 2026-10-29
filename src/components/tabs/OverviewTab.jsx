import React, { useState } from 'react';
import {
  Users,
  Wallet,
  Target,
  TrendingUp,
  Calendar,
  Share2,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useGrowthData } from '../../context/GrowthDataContext';

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
  } = useGrowthData();

  // Interactive Scenario Simulator state
  const [viralBoostMultiplier, setViralBoostMultiplier] = useState(1.15); // +15% boost
  const [ambassadorActivityLift, setAmbassadorActivityLift] = useState(20); // +20% lift

  // Simulated final calculation
  const simulatedRemainingPerDay = parseFloat(velocity) * (1 + (viralBoostMultiplier - 1) + ambassadorActivityLift / 100);
  const simulatedFinalProjected = Math.round(totalRegistrations + simulatedRemainingPerDay * remainingDays);

  // Scaling for 7-day chart
  const maxDayVal = Math.max(...dailyMetrics.map((d) => Math.max(d.target, d.actual)), 120);

  return (
    <div className="view-container">
      {/* Executive Key Figures Banner */}
      <div className="executive-kpi-bar">
        <div className="kpi-cell" onClick={() => setActiveTab('registrations')}>
          <div className="kpi-cell-label">Total Registrations</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{totalRegistrations}</span>
            <span className="kpi-sub">/ {campaign.targetRegistrations}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-indigo">{progressPercent}% of Goal</span>
            <span className="kpi-caption">{remainingRegistrations} needed</span>
          </div>
        </div>

        <div className="kpi-cell" onClick={() => setActiveTab('acquisition')}>
          <div className="kpi-cell-label">Budget Utilized</div>
          <div className="kpi-cell-val">
            <span className="mono-num">₹{totalSpend.toLocaleString()}</span>
            <span className="kpi-sub">/ ₹{campaign.totalBudget.toLocaleString()}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-cyan">{budgetPercent}% Spent</span>
            <span className="kpi-caption">₹{campaign.totalBudget - totalSpend} runway</span>
          </div>
        </div>

        <div className="kpi-cell" onClick={() => setActiveTab('acquisition')}>
          <div className="kpi-cell-label">Blended CAC</div>
          <div className="kpi-cell-val">
            <span className="mono-num">₹{blendedCac}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-green">Efficient</span>
            <span className="kpi-caption">Target: &lt; ₹4.00</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Daily Velocity</div>
          <div className="kpi-cell-val">
            <span className="mono-num">{velocity}</span>
            <span className="kpi-sub">/ day</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-amber">Pacing ~{projectedFinal}</span>
            <span className="kpi-caption">Need {neededDailyVelocity}/day</span>
          </div>
        </div>

        <div className="kpi-cell">
          <div className="kpi-cell-label">Campaign Timeline</div>
          <div className="kpi-cell-val">
            Day <span className="mono-num">{campaign.currentDay}</span>
            <span className="kpi-sub">/ {campaign.totalDays}</span>
          </div>
          <div className="kpi-meta">
            <span className="badge badge-purple">{remainingDays} Days Left</span>
            <span className="kpi-caption">Workshop on Day 7</span>
          </div>
        </div>
      </div>

      {/* Main Row: 7-Day Pace vs Target Chart & Trajectory Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* 7-Day Chart */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>7-Day Registration Velocity</h3>
              <p className="card-subtitle">Daily actual registrations vs planned milestone targets</p>
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

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Active Run-rate: <strong>{velocity} signups/day</strong></span>
            <span>Forecast at current pace: <strong style={{ color: 'var(--primary)' }}>~{projectedFinal} total</strong></span>
          </div>
        </div>

        {/* 7-Day Milestone Table */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Milestone Burn-up Table</h3>
              <p className="card-subtitle">Daily targets, verified actuals, and cumulative trajectory</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Target</th>
                  <th>Actual</th>
                  <th>Variance</th>
                  <th>Cumulative</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dailyMetrics.map((row) => {
                  const isPastOrCurrent = row.day <= campaign.currentDay;
                  const delta = isPastOrCurrent ? row.actual - row.target : null;
                  const isCurrent = row.day === campaign.currentDay;

                  return (
                    <tr key={row.day} style={isCurrent ? { background: 'var(--primary-tint)' } : undefined}>
                      <td>
                        <strong>Day {row.day}</strong>
                        {isCurrent && <span className="badge badge-indigo" style={{ marginLeft: '6px', fontSize: '0.66rem' }}>Today</span>}
                      </td>
                      <td className="mono-cell">{row.target}</td>
                      <td className="mono-cell">
                        {isPastOrCurrent ? (
                          <strong style={{ color: 'var(--text-highlight)' }}>{row.actual}</strong>
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>-- (est. {row.target})</span>
                        )}
                      </td>
                      <td className="mono-cell">
                        {delta !== null ? (
                          delta >= 0 ? (
                            <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>+{delta}</span>
                          ) : (
                            <span style={{ color: 'var(--accent-rose)', fontWeight: '600' }}>{delta}</span>
                          )
                        ) : (
                          <span style={{ color: 'var(--text-dim)' }}>--</span>
                        )}
                      </td>
                      <td className="mono-cell">
                        <strong>{row.cumulative}</strong>
                      </td>
                      <td>
                        {isPastOrCurrent ? (
                          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                            <CheckCircle2 size={11} /> On Track
                          </span>
                        ) : (
                          <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Upcoming</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Second Row: Channel Share & Forecast Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Acquisition Channel Contributions */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Acquisition Channel Share</h3>
              <p className="card-subtitle">Registrations by channel and proportion of total volume</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('acquisition')}>
              View Channels
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {channels.map((channel) => {
              const share = totalRegistrations > 0 ? Math.round((channel.registrations / totalRegistrations) * 100) : 0;
              return (
                <div key={channel.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.82rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: channel.color }} />
                      {channel.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-highlight)' }}>{channel.registrations}</strong> signups ({share}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
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

          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Zero-Cost Organic: <strong>{channels.filter((c) => c.spend === 0).reduce((s, c) => s + c.registrations, 0)} signups (85%)</strong></span>
            <span>Paid Micro-Boost: <strong>{channels.filter((c) => c.spend > 0).reduce((s, c) => s + c.registrations, 0)} signups (15%)</strong></span>
          </div>
        </div>

        {/* Forecast Scenario Simulator */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-box">
              <h3>Interactive Forecast Model</h3>
              <p className="card-subtitle">Adjust remaining 3-day growth lever assumptions</p>
            </div>
            <span className="badge badge-indigo">Scenario Engine</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
                <label htmlFor="viral-boost" style={{ fontWeight: '600' }}>WhatsApp Viral Forwarding Multiplier</label>
                <span className="mono-num" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                  +{Math.round((viralBoostMultiplier - 1) * 100)}% Lift
                </span>
              </div>
              <input
                id="viral-boost"
                type="range"
                min="1.0"
                max="1.5"
                step="0.05"
                value={viralBoostMultiplier}
                onChange={(e) => setViralBoostMultiplier(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Baseline (1.0x)</span>
                <span>Moderate (+25%)</span>
                <span>High Viral (+50%)</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem' }}>
                <label htmlFor="amb-lift" style={{ fontWeight: '600' }}>Ambassador Referral Engagement Lift</label>
                <span className="mono-num" style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>
                  +{ambassadorActivityLift}% Referrals
                </span>
              </div>
              <input
                id="amb-lift"
                type="range"
                min="0"
                max="50"
                step="5"
                value={ambassadorActivityLift}
                onChange={(e) => setAmbassadorActivityLift(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>0% Lift</span>
                <span>+25% with Swag Unlocks</span>
                <span>+50% with Mentorship</span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Simulated Projected Total
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-highlight)' }}>
                  {simulatedFinalProjected}
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-emerald)', marginLeft: '8px' }}>
                    (+{Math.max(0, simulatedFinalProjected - campaign.targetRegistrations)} over target)
                  </span>
                </div>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setIsQuickRegOpen(true)}>
                + Test Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Campaign Levers */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-box">
            <h3>Key Growth Levers</h3>
            <p className="card-subtitle">Tactical execution framework to deliver 500 registrations within ₹2,000 budget</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('experiments')}>
            Experiments Backlog
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Lever 1 • Viral WhatsApp Loops
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
              Pre-crafted curiosity copy with zero marketing jargon. Classmates share project teaser ("Build AI Resume Evaluator in 15 lines of code") into college batch groups.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Lever 2 • Ambassador Milestones
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
              12 student leaders across VBIT, SRM, COEP, RVCE, KIIT motivated by non-monetary career rewards (1-on-1 AI Resume Review at 15 referrals; Letter of Recommendation at 30).
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-emerald)', marginBottom: '4px', textTransform: 'uppercase' }}>
              Lever 3 • Micro-Paid Boost
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
              ₹150/day targeted Instagram short-form video demonstration showing the finished AI project in action. Seeds initial momentum and preserves ₹760 buffer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
